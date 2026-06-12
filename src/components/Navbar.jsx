import { useState } from 'react'

const navItems = [
  { label: '首頁', href: 'index.html' },
  { label: '無院講師', href: 'instructors.html' },
  { label: '跨界 Project', href: 'projects.html' },
  { label: '排行榜', href: 'leaderboard.html' },
  { label: '優秀學員', href: 'awards.html' },
  { label: '成員資源', href: 'resources.html' },
  { label: '報名課程', href: 'contact.html' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const currentPage = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'index.html' : 'index.html'

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="index.html" className="flex items-center gap-2 group">
            <img
              src="/assets/logo-main.jpg"
              alt="無學院 Wu Academy"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.href || (currentPage === '' && item.href === 'index.html')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-wu-blue bg-blue-50'
                      : 'text-gray-700 hover:text-wu-blue hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.href || (currentPage === '' && item.href === 'index.html')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'text-wu-blue bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}