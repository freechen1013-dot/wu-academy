import Navbar from './Navbar'
import Footer from './Footer'
import { SiteDataProvider } from '../contexts/SiteDataContext'

export default function Layout({ children }) {
  return (
    <SiteDataProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </SiteDataProvider>
  )
}