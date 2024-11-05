import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/loginPage";
import OAuthCallback from "./components/oAuthCallback";
import UserPage from "./pages/userPage";
import BookPage from "./pages/bookPage";

function App() {

  // const isLoggedIn = localStorage.getItem('jwt');

  const isLoggedIn = true;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/epub-viewer" element={<BookPage/>} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <UserPage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            isLoggedIn
              ? <UserPage />
              : <Navigate to="/login" replace /> 
          }
        />
      </Routes>
    </>
  );
}

export default App;
