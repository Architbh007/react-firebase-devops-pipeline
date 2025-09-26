import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./common/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

export default function App() {
  const shell = { fontFamily: "system-ui, Arial", background: "#fafafa", minHeight: "100vh" };

  return (
    <div style={shell}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* placeholders to match wireframe*/}
        <Route path="/search" element={<div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}><h2>Search (placeholder)</h2></div>} />
        <Route path="/post" element={<div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}><h2>Post (placeholder)</h2></div>} />
      </Routes>
    </div>
  );
}
