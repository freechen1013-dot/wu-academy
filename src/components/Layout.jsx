import Navbar from './Navbar'
import Footer from './Footer'

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: '無學院 Wu Academy',
  alternateName: 'Wu Academy',
  description: '一個由學生輪流擔任講師的跨界學習社群，以無界、無限、無懼為核心，透過課程、積分、一問與跨界專案推動自由學習。',
  url: 'https://wu-academy.onrender.com',
  founder: { '@type': 'Person', name: '陳孚瑞 (Felix Chen)' },
  knowsLanguage: ['zh-TW', 'en'],
  slogan: '無界．無限．無懼',
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}