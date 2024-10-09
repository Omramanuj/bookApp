import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/loginPage";
import Dashboard from "./pages/dashboard";
import OAuthCallback from "./components/oAuthCallback";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Routes>
    </>
  );
}

export default App;
