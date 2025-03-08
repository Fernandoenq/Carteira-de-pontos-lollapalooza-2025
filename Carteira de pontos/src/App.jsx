// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CpfInput from "../src/Pages/CpfInput";
import Carteirapontos from "./Pages/Carteirapontos";
import "./style/Carteirapontos.css";
import "./style/CpfInput.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CpfInput />} />
        <Route path="/carteira" element={<Carteirapontos />} />
      </Routes>
    </Router>
  );
}

export default App;