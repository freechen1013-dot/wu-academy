import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <HomePage />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)