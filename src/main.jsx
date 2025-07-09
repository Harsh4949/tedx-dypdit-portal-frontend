import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OCRReader from './OCRReader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OCRReader/>
    <App />
  </StrictMode>,
)
