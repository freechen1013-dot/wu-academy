import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import Resources from '../pages/Resources'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <Resources />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)