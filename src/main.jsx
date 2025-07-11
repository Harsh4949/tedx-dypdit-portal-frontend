import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import OCRReader from './components/OCRReader.jsx'
// import ResistrationForm from './components/ResistrationForm.jsx'

import {ResistrationForm,OCRReader} from './components/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Tedx DYPIT Portal</h1>
    <p>Welcome to the Tedx DYPIT Portal</p>
    <p>Submit your payment details below:</p>
    <p>Note: This is a demo portal, please do not submit real payment details</p>
    <ResistrationForm/> 
    <OCRReader />
    <App />
  </StrictMode>,
)
