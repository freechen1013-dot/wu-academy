import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import Projects from '../pages/Projects'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <Projects />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)