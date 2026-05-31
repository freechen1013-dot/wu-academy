import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Projects from '../pages/Projects'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Projects />
  </StrictMode>,
)