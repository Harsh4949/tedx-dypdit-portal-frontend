import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OCRReader from './components/OCRReader.jsx'
import ResistrationForm from './components/ResistrationForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <ResistrationForm/> 
    <App />
  </StrictMode>,
)
