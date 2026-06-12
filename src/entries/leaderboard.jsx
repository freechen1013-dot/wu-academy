import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import LeaderboardPage from '../pages/LeaderboardPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <Layout>
        <LeaderboardPage />
      </Layout>
    </SiteDataProvider>
  </StrictMode>,
)
