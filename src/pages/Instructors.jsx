import { useSiteData } from '../contexts/SiteDataContext'

const accentStyles = {
  blue: { bg: 'bg-wu-blue', text: 'text-wu-blue', badge: 'bg-wu-blue/10 text-wu-blue', slant: 'bg-wu-blue' },
  green: { bg: 'bg-emerald-400', text: 'text-emerald-500', badge: 'bg-emerald-400/10 text-emerald-500', slant: 'bg-emerald-400' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-600', badge: 'bg-violet-500/10 text-violet-600', slant: 'bg-violet-500' },
}

export default function Instructors() {
  const { isLoading, error, instructors } = useSiteData()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">載入中...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">錯誤：{error}</div>

  return (
    <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">無院講師</h2>
            <p className="text-gray-500">Instructors</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {(instructors || []).map((instructor, idx) => {
              const s = accentStyles[instructor.accent] || accentStyles.blue
              return (
              <div key={idx} className="relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className={`absolute top-0 left-0 w-24 h-full ${s.slant} slant-decoration opacity-90`} />
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                      {instructor.avatar ? (
                        <img
                          src={instructor.avatar}
                          alt={instructor.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <span className="text-3xl md:text-4xl font-bold text-gray-400">
                          {instructor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className={`inline-block px-3 py-1 ${s.badge} text-xs font-bold rounded-full mb-3`}>
                      {instructor.role}
                    </div>
                    <h3 className="text-2xl font-black text-wu-black mb-2">{instructor.name}</h3>
                    <p className={`${s.text} font-medium mb-3`}>{instructor.subject}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{instructor.description}</p>
                  </div>
                </div>
              </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-wu-yellow/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-wu-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">更多講師即將加入</h3>
              <p className="text-sm text-gray-500">無學院的講師陣容持續擴大中，敬請期待！</p>
            </div>
          </div>
        </div>
      </section>
  )
}