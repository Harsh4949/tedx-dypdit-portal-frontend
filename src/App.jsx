import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterComponent from "./components/RegistrationForm/RegisterComponent";
import AdminPortal from "./components/AdminPortal/AdminPortal";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL || "/tedx-dypdit-portal-frontend"}>
      <Routes>
        <Route path="/" element={<RegisterComponent />} />
        <Route path="/admin" element={<AdminPortal />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
