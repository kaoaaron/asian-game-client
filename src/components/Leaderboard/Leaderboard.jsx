import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuizStore, { ScreenEnum } from "../../store";
import { fetchLeaderboardData } from "../../api";
import {
  Button,
  Container,
  CircularProgress,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
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
  const setScreen = useQuizStore((state) => state.setScreen);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(10); //10, 30, 50, 100, 150, 200
  const [filteredData, setFilteredData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchLeaderboardData();
      setData(result);
      setFilteredData([
        ...(result[filter] || []).map((x) => ({
          ...x,
          completedAt: new Date(x.completedAt),
        })),
      ]);
    };

    fetch();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setFilteredData([
      ...(data[event.target.value] || []).map((x) => ({
        ...x,
        completedAt: new Date(x.completedAt),
      })),
    ]);
  };

  return (
    <Container>
      <Typography variant="h1" sx={{ color: "gold", fontSize: "3rem" }}>
        Leaderboard
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={filter}
          onChange={handleFilterChange}
          aria-label="filter"
          name="filter"
        >
          <FormControlLabel value="10" control={<Radio />} label="10" />
          <FormControlLabel value="30" control={<Radio />} label="30" />
          <FormControlLabel value="50" control={<Radio />} label="50" />
          <FormControlLabel value="100" control={<Radio />} label="100" />
          <FormControlLabel value="150" control={<Radio />} label="150" />
          <FormControlLabel value="200" control={<Radio />} label="200" />
        </RadioGroup>
      </FormControl>
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
            {filteredData ? (
              filteredData.map((row, idx) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        onClick={() => {
          setZoomFinished(false);
          setScreen(ScreenEnum.START);
          navigate("/");
        }}
        sx={{ display: "flex", margin: "16px auto" }}
      >
        Back to Start Game
      </Button>
    </Container>
  );
};

export default Leaderboard;
