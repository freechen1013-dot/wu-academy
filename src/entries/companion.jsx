import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import CompanionWorkspace from '../pages/CompanionWorkspace'

createRoot(document.getElementById('root')).render(
  <StrictMode><SiteDataProvider><Layout><CompanionWorkspace /></Layout></SiteDataProvider></StrictMode>,
)
