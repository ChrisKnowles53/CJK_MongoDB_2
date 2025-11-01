import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home.page";
import Login from "./Pages/Login.Page";
import Signup from "./Pages/Signup.page";
import PrivateRoute from "./Pages/PrivateRoute.page";

export default function App() {
  return (
    <>
      {/* TEMP banner so we know the shell rendered */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          padding: 4,
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        App shell loaded
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
