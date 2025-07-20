import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import AdminPortal from './components/AdminPortal/AdminPortal.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrationPage />
  </StrictMode>,
)
