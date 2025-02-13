import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Carteirapontos.css";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const Carteirapontos = () => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const API_URL = "https://sua-api.com/dados"; // Substitua pela URL correta da sua API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        setNomeUsuario(data.nome);
        setTransacoes(data.transacoes);

        const total = data.transacoes.reduce((acc, transacao) => acc + transacao.pontos, 0);
        setSaldoTotal(total);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="carteirinha-container">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bradesco_logo.svg" alt="Bradesco" className="logo" />
      <CardContent>
        <Typography variant="h6" className="carteirinha-title">
          Olá {nomeUsuario}, seja bem-vindo à sua carteira Bradesco da Lollapalooza 2025
        </Typography>

        <TableContainer component={Paper} className="tabela-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Origem</strong></TableCell>
                <TableCell><strong>Pontos</strong></TableCell>
                <TableCell><strong>Horário</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacoes.map((transacao, index) => (
                <TableRow key={index}>
                  <TableCell>{transacao.origem}</TableCell>
                  <TableCell className={transacao.pontos >= 0 ? "positivo" : "negativo"}>
                    {transacao.pontos}
                  </TableCell>
                  <TableCell>{transacao.horario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button className="saldo-btn">
          Saldo atual: {saldoTotal}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Carteirapontos;
