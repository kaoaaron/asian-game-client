import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchLeaderboardData } from "../../api";
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const count = await fetchLeaderboardData();
      setData([
        ...count.map((x) => ({ ...x, completedAt: new Date(x.completedAt) })),
      ]);
    };

    fetch();
  }, []);
  return (
    <Container>
      <Typography variant="h1" sx={{ color: "gold", fontSize: "3rem" }}>
        Leaderboard!
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>
                  {`${((row.scored / row.total) * 100).toFixed(2)}% (${
                    row.scored
                  }/${row.total})`}
                </TableCell>
                <TableCell>{`${
                  row.completedAt.getMonth() + 1
                }/${row.completedAt.getDate()}, ${row.completedAt.getFullYear()}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ display: "flex", margin: "16px auto" }}
      >
        Back to Start Game
      </Button>
    </Container>
  );
};

export default Leaderboard;
