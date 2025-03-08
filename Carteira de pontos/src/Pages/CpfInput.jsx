import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CpfInput = () => {
  const [cpf, setCpf] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (cpf.length !== 11) {
      alert("CPF inválido! Insira um CPF válido.");
      return;
    }
    navigate("/carteira", { state: { cpf } });
  };

  return (
    <div>
      <h2>Digite seu CPF</h2>
      <input
        type="text"
        value={cpf}
        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
      />
      <button onClick={handleNext}>Avançar</button>
    </div>
  );
};

export default CpfInput;