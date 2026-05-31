import { useSiteData } from '../contexts/SiteDataContext'

export default function Footer() {
  const site = useSiteData()
  const { brand, email } = site

  return (
    <footer className="bg-wu-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <img
              src="/assets/logo-main.jpg"
              alt="無學院 Wu Academy"
              className="h-16 w-auto object-contain brightness-200"
            />
            <p className="text-sm text-gray-400">{brand.slogan}</p>
          </div>

          {/* Founder */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">院長</p>
            <p className="text-lg font-bold">{brand.founder}</p>
            <p className="text-sm text-gray-400">{brand.founderEn}</p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400 mb-1">聯絡我們</p>
            <a
              href={`mailto:${email}`}
              className="text-wu-yellow hover:underline text-sm"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© 2026 無學院 Wu Academy. All rights reserved.</p>
          <p className="mt-1">本站為動態展示網站，資料由後端 API 即時提供</p>
        </div>
      </div>
    </footer>
  )
}