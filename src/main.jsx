import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import AdminPortal from './components/AdminPortal/AdminPortal.jsx'
import ConfirmationPage from './components/ConfirmationPage/ConfirmationPage.jsx'
import Header from './components/Header/Header.jsx'
import PaymentGateway from './components/PaymentGateway/PaymentGateway.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <RegistrationPage /> */}
    {/* <ConfirmationPage /> */}
    {/* <PaymentGateway /> */}
    {/* <AdminPortal /> */}
    {/* <Header /> */}
    {/* <App /> */}

  </StrictMode>,
)
