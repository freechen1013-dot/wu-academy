import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Instructors from '../pages/Instructors'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Instructors />
  </StrictMode>,
)