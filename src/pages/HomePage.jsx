import { useState } from 'react'
import { useSiteData } from '../contexts/SiteDataContext'

// Icon components
function IconClock() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function IconUsers() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
}
function IconPresentation() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
}
function IconChat() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
}
function IconQuestion() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function IconTemplate() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
}

const iconMap = {
  clock: IconClock,
  users: IconUsers,
  presentation: IconPresentation,
  chat: IconChat,
  question: IconQuestion,
  template: IconTemplate,
}

// Core Value Modal
function CoreValueModal({ value, onClose }) {
  if (!value) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex items-end gap-2 mb-4">
          <img src="/assets/wu-character.png" alt="無" className="h-20 w-auto object-contain opacity-90" />
          <span className="text-4xl font-black text-wu-black">{value.zhTitle}</span>
        </div>
        <h3 className="text-xl font-bold text-wu-blue mb-2">{value.enTitle}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{value.zhText}</p>
        <p className="text-gray-500 text-sm italic mb-6">{value.enText}</p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed">{value.detail}</p>
        </div>
      </div>
    </div>
  )
}

// Interactive Calendar
function Calendar({ calendarData }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1))
  const [selectedSession, setSelectedSession] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const sessionsInMonth = calendarData.sessions.filter(s => {
    const d = new Date(s.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const sessionMap = {}
  sessionsInMonth.forEach(s => {
    const d = new Date(s.date)
    const day = d.getDate()
    if (!sessionMap[day]) sessionMap[day] = []
    sessionMap[day].push(s)
  })

  const instructorColors = { Felix: 'bg-wu-yellow', August: 'bg-wu-blue' }
  const instructorPanelColors = { Felix: 'bg-wu-yellow/10', August: 'bg-wu-blue/10' }
  const getInstructorColor = (name) => instructorColors[name] || 'bg-wu-yellow'
  const getPanelColor = (name) => instructorPanelColors[name] || 'bg-wu-yellow/10'

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  const days = []
  for (let i = 0; i < startDayOfWeek; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-lg font-bold">{year}年 {monthNames[month]}</h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <div key={idx} className="aspect-square">
            {day && (
              <button
                onClick={() => sessionMap[day] && setSelectedSession(sessionMap[day])}
                className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                  sessionMap[day]
                    ? 'text-wu-black font-bold cursor-pointer'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{day}</span>
                {sessionMap[day] && (
                  <div className="flex gap-0.5 mt-0.5">
                    {sessionMap[day].map((s, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${getInstructorColor(s.instructor)}`} />
                    ))}
                  </div>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedSession && (
        <div className={`mt-6 rounded-xl p-4 ${selectedSession.length <= 1 ? getPanelColor(selectedSession[0]?.instructor) : 'bg-wu-yellow/10'}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-wu-black">
              {selectedSession.length > 1 ? `${selectedSession[0].date} 課程` : selectedSession[0].course}
            </h4>
            <button onClick={() => setSelectedSession(null)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {selectedSession.map((s, i) => (
            <div key={i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${getInstructorColor(s.instructor)}`} />
                <p className="font-semibold text-wu-black text-sm">{s.course}</p>
              </div>
              <p className="text-sm text-gray-600 ml-4">時間：{s.time} | 講師：{s.instructor}</p>
              <p className="text-sm text-gray-700 ml-4">{s.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
        {Object.entries(instructorColors).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { isLoading, error, brand, stats, coreValues, courseModel, timeline2026, oneProblem, calendar } = useSiteData()
  const [modalValue, setModalValue] = useState(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-wu-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">載入失敗：{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-8">
            <img
              src="/assets/logo-main.jpg"
              alt="無學院 Wu Academy"
              className="mx-auto w-full max-w-2xl h-auto object-contain"
            />
          </div>
          <h1 className="sr-only">無學院 Wu Academy</h1>
          <p className="text-2xl md:text-4xl font-black tracking-widest text-wu-black mt-4">
            {brand.slogan}
          </p>
          <p className="text-sm md:text-base text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            無學院是一個由學生輪流擔任講師的學習空間。課程內容沒有邊界，學生可以教自己有興趣、擅長的內容；師生角色沒有固定限制，學生可以是老師，老師也可以是學生；學習過程鼓勵打破常規、提出創新想法，並透過積分、跨界專案與期末獎項，建立更自由也更有互動的學習社群。
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: '學院管理人員', value: stats.admin },
              { label: '學員', value: stats.students },
              { label: '講師', value: stats.instructors },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-wu-blue">
                <p className="text-5xl md:text-6xl font-black text-wu-black mb-2">{String(stat.value || 0).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">重要理念</h2>
            <p className="text-gray-500">三大核心精神</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(coreValues || []).map((value) => (
              <button
                key={value.enTitle}
                onClick={() => setModalValue(value)}
                className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 text-center hover:border-wu-blue hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-wu-blue opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)' }} />
                <div className="flex items-center justify-center gap-1 mb-4">
                  <img
                    src="/assets/wu-character.png"
                    alt="無"
                    className="h-28 w-auto object-contain opacity-90 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-5xl font-black text-wu-black relative top-4">{value.zhTitle?.[1]}</span>
                </div>
                <h3 className="text-lg font-bold text-wu-blue mb-2">{value.enTitle}</h3>
                <div className="mt-4 text-xs text-gray-400 group-hover:text-wu-blue transition-colors">
                  點擊了解更多 →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <CoreValueModal value={modalValue} onClose={() => setModalValue(null)} />

      {/* Course Model */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">課程模式</h2>
            <p className="text-gray-500">Course Model</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(courseModel || []).map((item, idx) => {
              const Icon = iconMap[item.icon]
              return (
                <div key={idx} className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow border-t-4 border-wu-yellow">
                  <div className="flex-shrink-0 p-2 bg-wu-yellow/10 rounded-lg text-wu-black">
                    <Icon />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">2026 時程</h2>
            <p className="text-gray-500">Timeline</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-wu-blue/30 transform md:-translate-x-1/2" />
            {(timeline2026 || []).map((item, idx) => (
              <div key={idx} className={`relative flex items-start mb-8 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-wu-blue rounded-full transform -translate-x-1/2 mt-1.5 z-10" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className="bg-gray-50 rounded-xl p-5 inline-block">
                    <span className="inline-block px-2 py-1 bg-wu-blue/10 text-wu-blue text-xs font-bold rounded mb-2">{item.phase}</span>
                    <p className="text-lg font-bold text-wu-black">{item.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-wu-black py-16 md:py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-wu-yellow/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-wu-blue/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="text-6xl text-wu-yellow/30 font-serif leading-none mb-4">"</div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">{oneProblem.title}</h2>
          <p className="text-xl text-wu-blue font-bold mb-6">{oneProblem.enTitle}</p>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            {oneProblem.description}
          </p>
          <div className="mt-8 text-gray-400 text-sm">
            每堂課結束時，講師會提出一個開放式問題作為作業。學生不只是回答標準答案，而是自由尋找資料、提出想法，並用自己的方式完成理解。
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">課程與講師 Calendar</h2>
            <p className="text-gray-500">點擊日期查看課程詳情</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {calendar && <Calendar calendarData={calendar} />}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-wu-black mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-wu-yellow rounded-full inline-block"></span>
                  即將到來的課程
                </h3>
                <div className="space-y-3">
                  {(calendar?.sessions || []).slice(0, 3).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs text-gray-400">{new Date(s.date).getMonth() + 1}月</p>
                        <p className="text-lg font-bold text-wu-black">{new Date(s.date).getDate()}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-wu-black">{s.course}</p>
                        <p className="text-xs text-gray-500">{s.time} · {s.instructor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-wu-blue/10 rounded-xl p-6">
                <h4 className="font-bold text-wu-black mb-2">課程模式提醒</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 8:25 會點名並加分</li>
                  <li>• 每次上課 30 分鐘，一位講師 15 分鐘</li>
                  <li>• 課程結束以「一問」方式佈置作業</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}