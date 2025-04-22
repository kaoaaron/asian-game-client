import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ClassicModeList from "./ClassicModeList";
import NewModeList from "./NewModeList";
import useQuizStore, { ScreenEnum } from "../../store";
import { fetchLeaderboardData } from "../../api";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";

const Leaderboard = () => {
  const DEFAULT_FILTER_COUNT = 10;
  const navigate = useNavigate();
  const setScreen = useQuizStore((state) => state.setScreen);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(DEFAULT_FILTER_COUNT); //10, 30, 50, 100, 150, 200
  const [filteredData, setFilteredData] = useState();
  const [mode, setMode] = useState("classic"); //classic, new

  useEffect(() => {
    setFilter(DEFAULT_FILTER_COUNT)
    const fetch = async () => {
      const result = await fetchLeaderboardData(mode);
      setData(result);
      setFilteredData([
        ...(result[DEFAULT_FILTER_COUNT] || []).map((x) => ({
          ...x,
          completedAt: new Date(x.completedAt),
        })),
      ]);
    };

    fetch();
  }, [mode]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setFilteredData([
      ...(data[event.target.value] || []).map((x) => ({
        ...x,
        completedAt: new Date(x.completedAt),
      })),
    ]);
  };

  const handleModeChange = (value) => {
    setMode(value);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <Typography variant="h1" sx={{ color: "gold", fontSize: "3rem" }}>
          Leaderboard
        </Typography>
        <Box>
          <ButtonGroup variant="outlined" aria-label="Mode button group">
            <Button
              onClick={() => handleModeChange("classic")}
              variant={mode === "classic" ? "contained" : "outlined"}
            >
              Classic
            </Button>
            <Button
              onClick={() => handleModeChange("new")}
              variant={mode === "new" ? "contained" : "outlined"}
            >
              New
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      {mode === "classic" ? (
        <ClassicModeList
          filter={filter}
          handleFilterChange={handleFilterChange}
          filteredData={filteredData}
        />
      ) : (
        <NewModeList
          filter={filter}
          handleFilterChange={handleFilterChange}
          filteredData={filteredData}
        />
      )}

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
