import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { SiteDataProvider } from '../contexts/SiteDataContext'
import Layout from '../components/Layout'
import ReviewWorkspace from '../pages/ReviewWorkspace'

createRoot(document.getElementById('root')).render(
  <StrictMode><SiteDataProvider><Layout><ReviewWorkspace /></Layout></SiteDataProvider></StrictMode>,
)
