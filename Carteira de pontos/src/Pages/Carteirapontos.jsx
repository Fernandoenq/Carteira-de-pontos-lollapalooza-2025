import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Carteirapontos = () => {
  const location = useLocation();
  const cpf = location.state?.cpf || "";
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [transacoes, setTransacoes] = useState([]);
  const [erroAPI, setErroAPI] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = `http://18.231.158.211:3335/Dashboard/GetBalanceByCpf`;

  useEffect(() => {
    if (!cpf) return;
    fetchData();
  }, [cpf]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErroAPI("");

      const response = await axios.get(API_URL, {
        headers: { Cpf: cpf },
        timeout: 10000,
      });

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Resposta inválida da API");
      }

      const data = response.data;
      const transacoesArray = Array.isArray(data) ? data : [data];

      let totalPontos = 0;
      const transacoesFormatadas = transacoesArray.map((transacao) => {
        totalPontos += transacao.Impact || 0;
        return {
          origem: transacao.ImpactOrigin || "Origem Desconhecida",
          pontos: transacao.Impact || 0,
          pontosTotal: totalPontos,
          horario: transacao.ImpactDate || "Data Indisponível",
        };
      });

      setSaldoAtual(totalPontos);
      setTransacoes(transacoesFormatadas);
    } catch (error) {
      setErroAPI("Erro ao conectar na API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Saldo da Carteira</h2>
      {erroAPI && <p style={{ color: "red" }}>{erroAPI}</p>}
      <table>
        <thead>
          <tr>
            <th>Origem</th>
            <th>Pontos</th>
            <th>Total</th>
            <th>Horário</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((transacao, index) => (
            <tr key={index}>
              <td>{transacao.origem}</td>
              <td>{transacao.pontos}</td>
              <td>{transacao.pontosTotal}</td>
              <td>{transacao.horario}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Saldo atual: {saldoAtual}</button>
    </div>
  );
};

export default Carteirapontos;
