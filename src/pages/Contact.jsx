import { useState } from 'react'
import Layout from '../components/Layout'
import { useSiteData } from '../contexts/SiteDataContext'

export default function Contact() {
  const site = useSiteData()
  const { email } = site

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[無學院報名諮詢] ${formData.name}`)
    const body = encodeURIComponent(
      `姓名：${formData.name}\nEmail：${formData.email}\n有興趣的課程：${formData.interest}\n\n訊息：\n${formData.message}`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-wu-black mb-2">報名課程</h2>
            <p className="text-gray-500">Contact Us</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-wu-black rounded-2xl p-6 text-white">
                <div className="w-12 h-12 bg-wu-yellow/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-wu-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-bold text-lg mb-2">無學院目前採邀請制</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  我們的課程與社群以推薦與邀請為主。如有興趣了解更多，歡迎來信聯絡學院團隊。
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-wu-black mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-wu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  聯絡信箱
                </h4>
                <a
                  href={`mailto:${email}`}
                  className="inline-block text-lg font-medium text-wu-blue hover:underline break-all"
                >
                  {email}
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-wu-black mb-3">加入前可以準備</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-wu-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                    簡單的自我介紹
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-wu-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                    你有興趣教學的主題（如果有的話）
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-wu-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                    為什麼想加入無學院
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-wu-black mb-2">已開啟郵件程式</h3>
                    <p className="text-gray-600 text-sm mb-4">請確認你的郵件程式已開啟，並送出信件給我們。</p>
                    <p className="text-gray-500 text-xs">如果沒有自動開啟，請手動寄信至：{email}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:outline-none transition-colors"
                        placeholder="你的名字"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">有興趣的課程或主題</label>
                      <input
                        type="text"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:outline-none transition-colors"
                        placeholder="例如：Critical Thinking、文學、程式設計..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">訊息</label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wu-blue focus:outline-none transition-colors resize-none"
                        placeholder="簡單介紹你自己，或想問的問題..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-wu-blue text-white font-bold rounded-xl hover:bg-wu-blue/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      寄送報名諮詢
                    </button>
                    <p className="text-xs text-gray-400 text-center">此表單將透過你裝置的郵件程式寄出</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}