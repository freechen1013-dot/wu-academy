import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Resources from '../pages/Resources'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Resources />
  </StrictMode>,
)