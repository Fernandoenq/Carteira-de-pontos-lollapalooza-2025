import React from "react";
import Carteirapontos from "./Pages/Carteirapontos/Carteirapontos";
import "./App.css";
import backgroundImage from "./assets/Bradesco.webp.jpg"; // Importa a imagem corretamente

function App() {
  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Carteirapontos />
    </div>
  );
}

export default App;
