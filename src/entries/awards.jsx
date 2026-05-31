import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import Awards from '../pages/Awards'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <Awards />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)