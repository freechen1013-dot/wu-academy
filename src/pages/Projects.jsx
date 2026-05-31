import Layout from '../components/Layout'
import { useSiteData } from '../contexts/SiteDataContext'

export default function Projects() {
  const site = useSiteData()
  const { project } = site

  const placeholderProjects = [
    { title: '專案一', desc: '即將登場' },
    { title: '專案二', desc: '即將登場' },
    { title: '專案三', desc: '即將登場' },
  ]

  return (
    <Layout>
      <section className="bg-wu-black py-16 md:py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wu-yellow/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">{project.title}</h2>
          <p className="text-xl text-wu-blue font-bold mb-6">{project.enTitle}</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">{project.detail}</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-wu-black mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-wu-blue rounded-full"></span>
              專案時程
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1 bg-wu-blue/10 rounded-lg p-4 text-center">
                <p className="font-bold text-wu-blue">期中～期末</p>
                <p className="text-gray-600">8/28 ~ 9/25</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
              <div className="flex-1 bg-wu-yellow/10 rounded-lg p-4 text-center">
                <p className="font-bold text-wu-black">期末頒獎</p>
                <p className="text-gray-600">10/2</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-wu-yellow/10 rounded-full mb-4">
              <span className="w-2 h-2 bg-wu-yellow rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-wu-black">Coming Soon</span>
            </div>
            <h3 className="text-2xl font-black text-wu-black mb-2">專案成果展示</h3>
            <p className="text-gray-500">2026 學期跨界專案將於期中後陸續公開</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placeholderProjects.map((proj, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-gray-400 font-medium">{proj.title}</p>
                <p className="text-gray-300 text-sm">{proj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}