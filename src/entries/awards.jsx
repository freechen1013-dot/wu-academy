import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Awards from '../pages/Awards'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Awards />
  </StrictMode>,
)