import { useState } from 'react'
import { useSiteData } from '../contexts/SiteDataContext'

const homeworks = [
  {
    id: 'critical-thinking-1',
    course: 'Critical Thinking in English Reading and Comprehension',
    question: '你認同Harper Lee 所創造的這樣一個「完美的角色」嗎？',
    deadline: '2026-06-12',
    accent: 'blue',
    instructor: 'Felix',
    email: 'freechen1013@gmail.com',
  },
  {
    id: 'critical-thinking-2',
    course: 'Critical Thinking in English Reading and Comprehension',
    question: '你認為辯論和argumentative text 在文學世界存在的意義是什麼？為何要學習？',
    deadline: '2026-06-19',
    deadlineLabel: '2026-06-19 8:30pm',
    accent: 'blue',
    instructor: 'Felix',
    email: 'freechen1013@gmail.com',
  },
  {
    id: 'critical-thinking-3',
    course: 'Critical Thinking in English Reading and Comprehension',
    question: '各位認為「說」與「寫」最大的不同是什麼？',
    deadline: '2026-07-03T20:30:00',
    deadlineLabel: '7/3 上課前（8:30pm）',
    accent: 'blue',
    instructor: 'Felix',
    email: 'freechen1013@gmail.com',
  },
  {
    id: 'tech-knowledge',
    course: '科技新知課',
    question: '未來可能會誕生什麼樣的科技或發明？他們大概會以什麼形式出現？',
    deadline: '2026-06-12',
    accent: 'green',
    instructor: 'August',
    email: null,
  },
  {
    id: 'f1-tech',
    course: 'F1車輛的科技原理',
    question: '你們認為F1未來會做出什麼樣的改變？油電比會做出什麼樣的改變嗎？',
    deadline: '2026-06-26',
    deadlineLabel: '6/26 上課前',
    accent: 'violet',
    instructor: 'Andy',
    email: null,
  },
]

const videos = []

const accentStyles = {
  blue: {
    border: 'border-wu-blue/30',
    bg: 'bg-wu-blue/10',
    dot: 'bg-wu-blue',
    text: 'text-wu-blue',
    ring: 'ring-wu-blue/40',
    from: 'from-wu-blue',
  },
  green: {
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/10',
    dot: 'bg-emerald-400',
    text: 'text-emerald-500',
    ring: 'ring-emerald-400/40',
    from: 'from-emerald-400',
  },
  violet: {
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    dot: 'bg-violet-500',
    text: 'text-violet-600',
    ring: 'ring-violet-500/40',
    from: 'from-violet-500',
  },
}

function getDeadlineInfo(deadline, label) {
  const now = new Date()
  const d = new Date(deadline)
  d.setHours(23, 59, 59, 999)
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return { label: '已到期', urgent: true }
  if (diff <= 3) return { label: `剩 ${diff} 天`, urgent: true }
  return { label: label || deadline, urgent: false }
}

function HomeworkCard({ hw, onClick }) {
  const styles = accentStyles[hw.accent]
  const deadline = getDeadlineInfo(hw.deadline, hw.deadlineLabel)

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-[280px] md:w-[360px] snap-start bg-white rounded-2xl shadow-sm border-2 text-left transition-all hover:shadow-md hover:-translate-y-1 ${deadline.urgent ? 'border-red-400 ring-2 ring-red-200' : styles.border}`}
    >
      <div className={`h-2 rounded-t-2xl ${styles.bg}`} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <span className={`text-xs font-bold ${styles.text}`}>{hw.course}</span>
        </div>
        <h3 className="font-bold text-wu-black text-base mb-4 line-clamp-2">
          {hw.course} 課程作業
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${deadline.urgent ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-xs ${deadline.urgent ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
              {deadline.label}
            </span>
          </div>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}

function SubmissionView({ hw, answer, setAnswer, onSubmit, onBack }) {
  const styles = accentStyles[hw.accent]
  const canSubmit = answer.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-wu-black transition-colors mb-6 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">返回成員資源專區</span>
      </button>

      <div className={`p-1 rounded-2xl bg-gradient-to-r ${styles.from} to-transparent`}>
        <div className="bg-white rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
            <span className={`text-xs font-bold ${styles.text}`}>{hw.course}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-wu-black mb-6">{hw.course} 課程作業</h2>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">📝 題目</p>
            <p className="text-gray-800 leading-relaxed">{hw.question}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2">✏️ 我的回答</p>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="請輸入你的作業內容..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:ring-2 focus:ring-wu-blue/20 outline-none resize-vertical text-sm leading-relaxed transition-all"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              canSubmit
                ? 'bg-wu-blue text-white shadow-lg shadow-wu-blue/30 hover:bg-wu-blue/90 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            送出答案
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            * 此區域僅限作業繳交使用，嚴禁其他用途。
          </p>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ video, onClick }) {
  const styles = accentStyles[video.accent]
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-[280px] md:w-[360px] snap-start bg-white rounded-2xl shadow-sm border-2 text-left transition-all hover:shadow-md hover:-translate-y-1 ${styles.border}`}
    >
      <div className={`h-32 rounded-t-2xl ${styles.bg} flex items-center justify-center`}>
        <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <span className={`text-xs font-bold ${styles.text}`}>{video.course}</span>
        </div>
        <p className="text-sm font-bold text-wu-black line-clamp-2">{video.title}</p>
        {video.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>
    </button>
  )
}

function VideoView({ video, message, setMessage, onSubmit, onBack }) {
  const styles = accentStyles[video.accent]
  const canSubmit = message.trim().length > 0

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-wu-black transition-colors mb-6 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">返回成員資源專區</span>
      </button>

      <div className={`p-1 rounded-2xl bg-gradient-to-r ${styles.from} to-transparent`}>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={video.url}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
              <span className={`text-xs font-bold ${styles.text}`}>{video.course}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-wu-black mb-2">{video.title}</h2>
            {video.description && (
              <p className="text-sm text-gray-600 mb-6">{video.description}</p>
            )}

            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-500 mb-3">💬 有問題想問講師？</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="輸入你想問的問題..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:ring-2 focus:ring-wu-blue/20 outline-none resize-vertical text-sm leading-relaxed transition-all"
              />
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all ${
                  canSubmit
                    ? 'bg-wu-blue text-white shadow-lg shadow-wu-blue/30 hover:bg-wu-blue/90 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                發送問題
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Modal({ message, onContinue, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-sm mx-4 w-full animate-[fadeIn_0.2s_ease]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 bg-wu-yellow/20 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-wu-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button onClick={onContinue} className="flex-1 py-2.5 rounded-xl bg-wu-blue text-white font-bold text-sm hover:bg-wu-blue/90 shadow-lg shadow-wu-blue/30 transition-all">
            繼續
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Resources() {
  const { isLoading, error, resources } = useSiteData()
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [pendingHw, setPendingHw] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoMessage, setVideoMessage] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [pendingVideo, setPendingVideo] = useState(null)

  function handleSubmit() {
    if (!selected || !answer.trim()) return
    if (selected.email) {
      const subject = `作業繳交 - ${selected.course}`
      const body = `${selected.question}\n\n我的回答：\n${answer}`
      window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } else {
      setPendingHw(selected)
      setShowModal(true)
    }
  }

  function handleModalContinue() {
    setShowModal(false)
    if (pendingHw) {
      const subject = `作業繳交 - ${pendingHw.course}（代轉 - ${pendingHw.instructor}）`
      const body = `以下為 ${pendingHw.instructor} 講師之學員作業，請代為轉達\n\n${pendingHw.question}\n\n學員回答：\n${answer}`
      window.location.href = `mailto:freechen1013@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  function handleModalCancel() {
    setShowModal(false)
    setPendingHw(null)
  }

  function handleVideoSubmit() {
    if (!selectedVideo || !videoMessage.trim()) return
    if (selectedVideo.email) {
      const subject = `課程問題 - ${selectedVideo.course}`
      const body = `課程：${selectedVideo.title}\n\n問題：\n${videoMessage}`
      window.location.href = `mailto:${selectedVideo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } else {
      setPendingVideo(selectedVideo)
      setShowVideoModal(true)
    }
  }

  function handleVideoModalContinue() {
    setShowVideoModal(false)
    if (pendingVideo) {
      const subject = `課程問題（代轉 - ${pendingVideo.instructor}）`
      const body = `以下為 ${pendingVideo.instructor} 講師之學員問題\n\n課程：${pendingVideo.title}\n\n問題：\n${videoMessage}`
      window.location.href = `mailto:freechen1013@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  function handleVideoModalCancel() {
    setShowVideoModal(false)
    setPendingVideo(null)
  }

  function selectHomework(hw) {
    setSelected(hw)
    setAnswer('')
    setSelectedVideo(null)
    setVideoMessage('')
  }

  function selectVideo(video) {
    setSelectedVideo(video)
    setVideoMessage('')
    setSelected(null)
    setAnswer('')
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">載入中...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">錯誤：{error}</div>

  if (selected) {
    return (
      <section className="min-h-screen py-16 md:py-24 bg-gray-50">
        <SubmissionView hw={selected} answer={answer} setAnswer={setAnswer} onSubmit={handleSubmit} onBack={() => setSelected(null)} />
        {showModal && <Modal message="該講師尚未以gmail綁定此系統，將會透過院長傳達作業" onContinue={handleModalContinue} onCancel={handleModalCancel} />}
      </section>
    )
  }

  if (selectedVideo) {
    return (
      <section className="min-h-screen py-16 md:py-24 bg-gray-50">
        <VideoView video={selectedVideo} message={videoMessage} setMessage={setVideoMessage} onSubmit={handleVideoSubmit} onBack={() => setSelectedVideo(null)} />
        {showVideoModal && <Modal message="該講師尚未以gmail綁定此系統，將會透過院長傳達問題" onContinue={handleVideoModalContinue} onCancel={handleVideoModalCancel} />}
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">成員資源專區</h2>
          <p className="text-gray-500">Member Resources</p>
        </div>

        {videos.length > 0 ? (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-wu-black mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            課程影片
          </h3>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-4 snap-x snap-mandatory">
              {videos.map(v => (
                <VideoCard key={v.id} video={v} onClick={() => selectVideo(v)} />
              ))}
            </div>
          </div>
        </div>
        ) : (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-wu-black mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            課程影片
          </h3>
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border-2 border-dashed border-gray-200">
            目前無近期課程影片
          </div>
        </div>
        )}

        <div className="mb-12">
          <h3 className="text-xl font-bold text-wu-black mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            近期作業
          </h3>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-4 snap-x snap-mandatory">
              {homeworks.filter(hw => {
                const d = new Date(hw.deadline)
                const now = new Date()
                if (hw.deadline && hw.deadline.includes('T')) return d > now
                return d >= new Date(now.toDateString())
              }).map(hw => (
                <HomeworkCard key={hw.id} hw={hw} onClick={() => selectHomework(hw)} />
              ))}
              {homeworks.filter(hw => {
                const d = new Date(hw.deadline)
                const now = new Date()
                if (hw.deadline && hw.deadline.includes('T')) return d > now
                return d >= new Date(now.toDateString())
              }).length === 0 && (
                <div className="w-full text-center py-12 text-gray-400 text-sm">
                  目前無進行中的作業
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold text-wu-black mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            評分標準
          </h3>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border-2 border-gray-100">
            <img
              src="/assets/grading-rubric.png"
              alt="Grading Rubric"
              className="w-full max-w-3xl mx-auto rounded-xl"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-wu-blue/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-wu-black">{(resources || {}).courseTemplateTitle || '課程範本'}</h3>
                  <p className="text-xs text-gray-400">PDF · 13 頁</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{(resources || {}).description}</p>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">範本內容</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['封面頁', '自我介紹', '課程目的', '內容頁', '圖片頁', '引用頁', '圖表頁', '重要概念', 'Timeline', '一問', '結尾'].map((page) => (
                    <div key={page} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-wu-yellow rounded-full"></span>
                      {page}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <a href="https://canva.link/kyc96cutr00f9kc" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-wu-blue text-white font-bold rounded-xl hover:bg-wu-blue/90 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  前往 Canva 使用範本
                </a>
                <p className="text-xs text-gray-400 text-center mt-2">點擊後將在新分頁開啟 Canva</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-wu-yellow/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-wu-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-wu-black">{(resources || {}).exampleTitle || '優質課程範例'}</h3>
                  <p className="text-xs text-gray-400">PDF · 14 頁</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{(resources || {}).exampleDescription}</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <img src="/assets/logo-main.jpg" alt="Felix" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-wu-black">Felix（陳孚瑞）</p>
                    <p className="text-xs text-gray-500">Critical Thinking in English Reading and Comprehension</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={(resources || {}).exampleFile} download className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-wu-yellow text-wu-black font-bold rounded-xl hover:bg-wu-yellow/90 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  下載範例
                </a>
                <a href={(resources || {}).exampleFile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-wu-yellow hover:text-wu-black transition-colors">
                  預覽
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
