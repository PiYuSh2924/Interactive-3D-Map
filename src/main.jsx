import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import AdvancedGlobe from "./AdvancedGlobe"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdvancedGlobe />
  </StrictMode>
)
