import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import Contact from '../pages/Contact'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <Contact />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)