import Layout from '../components/Layout'
import { useSiteData } from '../contexts/SiteDataContext'

export default function Resources() {
  const site = useSiteData()
  const { resources } = site

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">課程範本專區</h2>
            <p className="text-gray-500">Resources</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-wu-blue/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-wu-black">{resources.courseTemplateTitle}</h3>
                  <p className="text-xs text-gray-400">PDF · 13 頁</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{resources.description}</p>
              
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
                <a
                  href="https://canva.link/kyc96cutr00f9kc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-wu-blue text-white font-bold rounded-xl hover:bg-wu-blue/90 transition-colors"
                >
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
                  <h3 className="font-bold text-wu-black">{resources.exampleTitle}</h3>
                  <p className="text-xs text-gray-400">PDF · 14 頁</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{resources.exampleDescription}</p>
              
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
                <a
                  href={resources.exampleFile}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-wu-yellow text-wu-black font-bold rounded-xl hover:bg-wu-yellow/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  下載範例
                </a>
                <a
                  href={resources.exampleFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-wu-yellow hover:text-wu-black transition-colors"
                >
                  預覽
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}