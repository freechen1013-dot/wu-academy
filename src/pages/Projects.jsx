import { useEffect, useRef, useState } from 'react'
import { useSiteData } from '../contexts/SiteDataContext'

function NodeMap() {
  return (
    <svg viewBox="0 0 520 360" className="w-full h-auto" role="img" aria-label="學伴共學連結示意圖">
      <path d="M64 234C128 160 139 103 232 110s86 99 157 70c31-13 49-43 76-77" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 9" className="text-wu-yellow/80" />
      <path d="M65 234c68 31 102 50 174 29 80-23 97 39 191 8" fill="none" stroke="currentColor" strokeWidth="2" className="text-wu-blue/70" />
      <path d="M232 110c-2 58 23 107 7 153" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50" />
      <circle cx="65" cy="234" r="17" fill="#ffd52e" />
      <circle cx="232" cy="110" r="28" fill="#3b82f6" />
      <circle cx="430" cy="271" r="20" fill="#ffd52e" />
      <circle cx="465" cy="103" r="11" fill="white" />
      <circle cx="239" cy="263" r="11" fill="white" />
      <circle cx="65" cy="234" r="5" fill="#111827" />
      <circle cx="232" cy="110" r="7" fill="white" />
      <circle cx="430" cy="271" r="6" fill="#111827" />
      <text x="36" y="279" fill="white" fontSize="14" fontWeight="700">學伴</text>
      <text x="196" y="158" fill="white" fontSize="14" fontWeight="700">共學</text>
      <text x="399" y="315" fill="white" fontSize="14" fontWeight="700">連結</text>
    </svg>
  )
}

function materialUrl(material) {
  return typeof material === 'string' ? material : material.url || material.href || material.link
}

function materialLabel(material) {
  return typeof material === 'string' ? '開啟教材' : material.title || material.name || material.label || '開啟教材'
}

function CoLearningCloudBoard({ outcomes }) {
  const [activeOutcome, setActiveOutcome] = useState(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(null)
  const dragged = useRef(false)

  useEffect(() => {
    if (!activeOutcome) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveOutcome(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeOutcome])

  const startPan = (event) => {
    if (event.button !== undefined && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
    dragged.current = false
    setIsDragging(true)
  }

  const movePan = (event) => {
    if (!dragStart.current) return
    const x = event.clientX - dragStart.current.x
    const y = event.clientY - dragStart.current.y
    if (Math.abs(x) > 5 || Math.abs(y) > 5) dragged.current = true
    setPan({ x: dragStart.current.panX + x, y: dragStart.current.panY + y })
  }

  const endPan = (event) => {
    if (!dragStart.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    dragStart.current = null
    setIsDragging(false)
    if (dragged.current) window.setTimeout(() => { dragged.current = false }, 0)
  }

  return (
    <>
      <div
        className={`relative mt-8 h-[29rem] overflow-hidden rounded-[2rem] border-2 border-wu-black bg-wu-black shadow-[8px_8px_0_#ffd52e] touch-none sm:h-[34rem] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        aria-label="學伴共學雲端成果牆，可拖曳探索"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="pointer-events-none absolute left-8 top-8 border-l-2 border-wu-yellow pl-3 text-sm font-bold leading-6 text-white/80 sm:left-12 sm:top-10">
          拖曳雲端，探索每一位學伴的共學足跡
          <br /><span className="text-wu-yellow">點擊雲朵，閱讀完整分享</span>
        </div>
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 sm:h-[42rem] sm:w-[68rem]" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))` }}>
          {outcomes.map((outcome, index) => {
            const angle = index * 2.4 - Math.PI / 2
            const distance = index === 0 ? 0 : 24 + (index % 3) * 8
            const x = 50 + Math.cos(angle) * distance
            const y = 50 + Math.sin(angle) * distance * 0.72
            const large = index % 3 === 0
            return (
              <button
                key={outcome.id || `${outcome.nickname}-${index}`}
                type="button"
                className={`group absolute -translate-x-1/2 -translate-y-1/2 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-wu-yellow ${large ? 'w-40 sm:w-52' : 'w-32 sm:w-40'}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => { if (!dragged.current) setActiveOutcome(outcome) }}
                aria-label={`閱讀 ${outcome.nickname || '學伴'} 的共學分享`}
              >
                <span className="relative block rounded-[48%_52%_48%_52%/55%_45%_55%_45%] border-2 border-wu-black bg-white px-5 py-5 shadow-[5px_5px_0_#3b82f6] transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                  <span className="absolute -left-3 bottom-2 h-7 w-10 rounded-full border-2 border-wu-black bg-white" />
                  <span className="absolute -right-2 top-3 h-6 w-8 rounded-full border-2 border-wu-black bg-white" />
                  <span className="relative block text-xs font-black tracking-wider text-wu-blue">學伴共學</span>
                  <span className="relative mt-1 block truncate text-lg font-black text-wu-black">{outcome.nickname || '匿名學伴'}</span>
                  <span className="relative mt-2 block truncate text-xs font-bold text-gray-500">點擊閱讀完整分享</span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="pointer-events-none absolute bottom-5 right-6 rounded-full bg-wu-yellow px-3 py-1 text-xs font-black text-wu-black">{outcomes.length} 位學伴已加入</p>
      </div>

      {activeOutcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-wu-black/80 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveOutcome(null) }}>
          <div role="dialog" aria-modal="true" aria-labelledby="outcome-dialog-title" className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border-2 border-wu-black bg-white shadow-[10px_10px_0_#ffd52e]">
            <div className="flex items-start justify-between border-b-2 border-wu-black bg-wu-blue p-5 text-white">
              <div><p className="text-xs font-black tracking-[0.18em] text-wu-yellow">學伴的共學足跡</p><h3 id="outcome-dialog-title" className="mt-1 text-2xl font-black">{activeOutcome.nickname || '匿名學伴'}</h3></div>
              <button type="button" onClick={() => setActiveOutcome(null)} className="border-2 border-white px-3 py-1 font-black transition-colors hover:bg-white hover:text-wu-black" aria-label="關閉成果詳情">關閉</button>
            </div>
            <div className="p-6 sm:p-8">
              <h4 className="mt-2 text-lg font-black text-wu-black">我的分享</h4>
              <p className="mt-3 whitespace-pre-wrap leading-8 text-gray-700">{activeOutcome.response || '這位學伴尚未留下文字分享。'}</p>
              {activeOutcome.feedback && <div className="mt-7 border-l-4 border-wu-yellow bg-gray-50 p-5"><p className="text-sm font-black text-wu-blue">老師的回饋</p><p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">{activeOutcome.feedback}</p></div>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function Projects() {
  const { isLoading, error } = useSiteData()
  const [partnerProject, setPartnerProject] = useState(null)
  const [activityState, setActivityState] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/partner-project', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        setPartnerProject(data)
        setActivityState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setActivityState('error')
      })

    return () => controller.abort()
  }, [])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-600">載入中...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">錯誤：{error}</div>

  const activeWeek = partnerProject?.activeWeek || partnerProject?.currentActivity || partnerProject?.activity
  const materials = activeWeek?.materials || activeWeek?.materialLinks || partnerProject?.materials || []
  const outcomes = (partnerProject?.outcomes || partnerProject?.gallery || []).filter((outcome) => outcome?.approved === true)
  const churchName = '中華基督教長老會國語禮拜堂龜山教會'

  return (
    <>
      <section className="relative overflow-hidden bg-wu-black py-16 text-white md:py-24">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-wu-blue/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-wu-yellow/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-wu-yellow">2026 CROSS PROJECT</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">偏鄉計劃｜學伴共學</h1>
            <p className="mt-3 text-lg font-bold text-wu-blue md:text-xl">Borderless Student Co-Learning Project</p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-gray-200 md:text-lg">
              以平衡的共學與長期陪伴，讓彼此在分享、提問與實作中持續成長；也透過穩定連結，縮小城鄉之間的學習資源落差。
            </p>
            <p className="mt-5 text-sm font-medium text-gray-300">合作教會｜{churchName}</p>
          </div>
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
            <NodeMap />
            <p className="mt-1 text-center text-sm text-gray-300">不以距離定義學習，以連結延長陪伴。</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-2xl bg-wu-blue p-7 text-white">
              <p className="text-sm font-bold tracking-wider text-white/70">PROJECT WINDOW</p>
              <h2 className="mt-2 text-3xl font-black">2026 下半年</h2>
              <p className="mt-3 leading-7 text-white/85">以固定節奏建立熟悉感，讓每一次相見都成為下一次共學的起點。</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-wu-yellow animate-pulse" />
                <div>
                  <h2 className="font-black text-wu-black">本週共學動態</h2>
                  <p className="text-sm text-gray-500">Active week & materials</p>
                </div>
              </div>
              {activityState === 'loading' && <p className="mt-5 text-sm text-gray-500">正在取得本週活動與教材...</p>}
              {activityState === 'error' && <p className="mt-5 text-sm text-gray-500">本週動態暫時無法取得，請稍後再試。</p>}
              {activityState === 'ready' && !activeWeek && <p className="mt-5 text-sm text-gray-500">本週活動尚未公告，敬請期待。</p>}
              {activityState === 'ready' && activeWeek && (
                <div className="mt-5">
                  <p className="font-bold text-wu-black">{activeWeek.title || activeWeek.name || '本週共學活動'}</p>
                  {(activeWeek.date || activeWeek.description || activeWeek.detail) && <p className="mt-1 text-sm leading-6 text-gray-600">{activeWeek.date && `${activeWeek.date}｜`}{activeWeek.description || activeWeek.detail}</p>}
                  {materials.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{materials.map((material, index) => materialUrl(material) && <a key={materialUrl(material) || index} href={materialUrl(material)} className="rounded-full bg-wu-yellow/20 px-3 py-1.5 text-sm font-bold text-wu-black transition-colors hover:bg-wu-yellow">{materialLabel(material)}</a>)}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-[0.16em] text-wu-blue">JOIN THE CONNECTION</p>
            <h2 className="mt-2 text-3xl font-black text-wu-black md:text-4xl">用你擅長的方式，成為一段學習關係</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <a href="companion.html" className="group rounded-2xl border-2 border-wu-blue bg-wu-blue p-7 text-white transition-transform hover:-translate-y-1">
              <p className="text-sm font-bold text-white/70">FOR STUDENTS</p><h3 className="mt-2 text-2xl font-black">成為學伴</h3><p className="mt-3 leading-7 text-white/85">帶著好奇與對話，和遠方的夥伴一起學習、一起完成每週的小目標。</p><span className="mt-6 inline-block font-bold text-wu-yellow">我要參與 →</span>
            </a>
            <a href="review.html" className="group rounded-2xl border-2 border-wu-black bg-white p-7 text-wu-black transition-transform hover:-translate-y-1">
              <p className="text-sm font-bold text-wu-blue">FOR LECTURERS</p><h3 className="mt-2 text-2xl font-black">講師回饋與審閱</h3><p className="mt-3 leading-7 text-gray-600">提供課程回饋、協助整理共學歷程，讓長期陪伴更貼近每位學伴的需要。</p><span className="mt-6 inline-block font-bold text-wu-blue">前往審閱 →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-wu-black">已核准成果</h2>
          <p className="mt-2 text-gray-500">Approved outcomes</p>
          {outcomes.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-gray-500">成果將在取得核准後公開於此。</p> : <CoLearningCloudBoard outcomes={outcomes} />}
        </div>
      </section>
    </>
  )
}
