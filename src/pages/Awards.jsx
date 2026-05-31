import Layout from '../components/Layout'
import { useSiteData } from '../contexts/SiteDataContext'

export default function Awards() {
  const site = useSiteData()
  const { awards } = site

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">優秀學員</h2>
            <p className="text-gray-500">期末獎項殿堂</p>
            <p className="text-sm text-gray-400 mt-4">2026 學期獎項將於 10/2 頒獎後公布得主</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-wu-blue slant-decoration" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-wu-yellow/20 rounded-full flex items-center justify-center text-wu-black font-black text-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-wu-black mb-2 group-hover:text-wu-blue transition-colors">{award.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{award.condition}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-xs">得主待公布</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}