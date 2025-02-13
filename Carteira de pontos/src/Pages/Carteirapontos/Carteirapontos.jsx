import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Carteirapontos.css";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from "@mui/material";

const Carteirapontos = () => {
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [transacoes, setTransacoes] = useState([]);
  const [erroAPI, setErroAPI] = useState("");

  const CPF_USUARIO = "48972352861"; 
  const API_URL = `http://18.231.158.211:3335/Dashboard/GetBalanceByCpf`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔹 Buscando dados da API...");

        const response = await axios.get(API_URL, {
          headers: { Cpf: CPF_USUARIO },
          timeout: 10000,
        });

        console.log("🔹 Resposta da API:", response.data);

        if (!response.data || typeof response.data !== "object") {
          throw new Error("Resposta inválida da API");
        }

        const data = response.data;

        // Se a API retornar múltiplas transações, converte para array corretamente
        const transacoesArray = Array.isArray(data) ? data : [data];

        // Calcular total acumulado dos pontos
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

        // Definir o saldo total com base na última transação acumulada
        const totalSaldo = transacoesFormatadas.length > 0 ? transacoesFormatadas[transacoesFormatadas.length - 1].pontosTotal : 0;
        setSaldoAtual(totalSaldo);

        setTransacoes(transacoesFormatadas);
        setErroAPI("");
      } catch (error) {
        console.error("❌ Erro ao buscar dados da API:", error);
        setErroAPI("Erro ao conectar na API. Verifique sua conexão ou o servidor.");
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh", backgroundColor: "#f0f0f0", overflow: "hidden" }}>
      <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
        <Card className="carteirinha-container" sx={{ maxWidth: 600, width: "100%", p: 4, borderRadius: 4, textAlign: "center", overflow: "hidden" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bradesco_logo.svg" alt="Bradesco" className="logo" style={{ width: 120, marginBottom: 15 }} />
          <CardContent>
            <Typography variant="h5" className="carteirinha-title" sx={{ fontWeight: "bold", mb: 2 }}>
              Olá, seja bem-vindo à sua carteira Bradesco da Lollapalooza 2025
            </Typography>

            {erroAPI ? (
              <Typography color="error" sx={{ fontSize: 20, fontWeight: "bold" }}>
                {erroAPI}
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper} className="tabela-container" sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Origem</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Pontos</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Horário</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transacoes.map((transacao, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: 16 }}>{transacao.origem}</TableCell>
                          <TableCell sx={{ fontSize: 16, fontWeight: "bold", color: transacao.pontos >= 0 ? "green" : "red" }}>
                            {transacao.pontos}
                          </TableCell>
                          <TableCell sx={{ fontSize: 16, fontWeight: "bold" }}>{transacao.pontosTotal}</TableCell>
                          <TableCell sx={{ fontSize: 16 }}>{transacao.horario}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  className="saldo-btn"
                  sx={{
                    width: "100%",
                    mt: 3,
                    height: 60,
                    backgroundColor: "#007BFF",
                    fontSize: 20,
                    fontWeight: "bold",
                    borderRadius: 3,
                    "&:hover": { backgroundColor: "#0056b3" },
                  }}
                >
                  Saldo atual: {saldoAtual}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Carteirapontos;
