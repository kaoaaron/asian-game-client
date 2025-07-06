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
  Box,
} from "@mui/material";

const Leaderboard = () => {
  const navigate = useNavigate();
  const setScreen = useQuizStore((state) => state.setScreen);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(10);
  const [filteredData, setFilteredData] = useState();
  const [leaderboardType, setLeaderboardType] = useState("classic");

  // Get available options based on mode
  const getAvailableOptions = () => {
    return leaderboardType === "new" ? [10, 30] : [10, 30, 50, 100, 150, 200];
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchLeaderboardData(leaderboardType);
      setData(result);
      setFilteredData([
        ...(result[filter] || []).map((x) => ({
          ...x,
          completedAt: new Date(x.completedAt),
        })),
      ]);
    };

    fetch();
  }, [leaderboardType]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setFilteredData([
      ...(data[event.target.value] || []).map((x) => ({
        ...x,
        completedAt: new Date(x.completedAt),
      })),
    ]);
  };

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    setLeaderboardType(newMode);
    // Reset filter to first available option for the new mode
    const availableOptions = newMode === "new" ? [10, 30] : [10, 30, 50, 100, 150, 200];
    setFilter(availableOptions[0]);
  };

  return (
    <Container sx={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5",
      py: 4,
      px: 2
    }}>
      {/* Back Button - Top */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setZoomFinished(false);
            setScreen(ScreenEnum.START);
            navigate("/");
          }}
          sx={{ 
            backgroundColor: "#ffd700",
            color: "#333",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)",
            "&:hover": {
              backgroundColor: "#e6b800",
              boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)"
            }
          }}
        >
          ← Back to Start Game
        </Button>
      </Box>

      <Typography 
        variant="h1" 
        sx={{ 
          color: "#333", 
          fontSize: { xs: "2rem", md: "3rem" },
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        🏆 Leaderboard
      </Typography>
      
      {/* Mode and Questions Selectors - Same Line */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        mb: 4,
        flexWrap: "wrap",
        gap: 3
      }}>
        {/* Mode Selector */}
        <FormControl component="fieldset">
          <Typography variant="h6" sx={{ color: "#333", mb: 2, textAlign: "center" }}>
            Select Mode
          </Typography>
          <RadioGroup
            row
            value={leaderboardType}
            onChange={handleModeChange}
            aria-label="mode"
            name="mode"
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <FormControlLabel 
              value="classic" 
              control={<Radio sx={{ color: "#ffd700", "&.Mui-checked": { color: "#ffd700" } }} />} 
              label="Classic" 
              sx={{ 
                color: "#333",
                margin: "0 16px",
                "& .MuiFormControlLabel-label": { fontWeight: "500" }
              }}
            />
            <FormControlLabel 
              value="new" 
              control={<Radio sx={{ color: "#ffd700", "&.Mui-checked": { color: "#ffd700" } }} />} 
              label="New" 
              sx={{ 
                color: "#333",
                margin: "0 16px",
                "& .MuiFormControlLabel-label": { fontWeight: "500" }
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* Question Count Selector */}
        <FormControl component="fieldset">
          <Typography variant="h6" sx={{ color: "#333", mb: 2, textAlign: "center" }}>
            Questions
          </Typography>
          <RadioGroup
            row
            value={filter}
            onChange={handleFilterChange}
            aria-label="filter"
            name="filter"
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {getAvailableOptions().map((option) => (
              <FormControlLabel 
                key={option}
                value={option} 
                control={<Radio sx={{ color: "#ffd700", "&.Mui-checked": { color: "#ffd700" } }} />} 
                label={option} 
                sx={{ 
                  color: "#333",
                  margin: "0 8px",
                  "& .MuiFormControlLabel-label": { fontWeight: "500" }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      
      {/* Leaderboard Table */}
      <Box sx={{ 
        backgroundColor: "white", 
        borderRadius: "16px", 
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        mb: 4
      }}>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
            <TableHead sx={{ backgroundColor: "#ffd700" }}>
              <TableRow>
                <TableCell sx={{ color: "#333", fontWeight: "bold" }}>Rank</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: "bold" }}>Player Name</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: "bold" }}>Score</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: "bold" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <TableRow
                    key={row.name}
                    sx={{ 
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f8f9fa" }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: "#333", fontWeight: "500" }}>
                      #{idx + 1}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ color: "#333", fontWeight: "500" }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ color: "#333" }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#ffd700" }}>
                        {`${((row.scored / row.total) * 100).toFixed(2)}%`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {`${row.scored}/${row.total}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#333" }}>
                      {`${row.completedAt.getMonth() + 1}/${row.completedAt.getDate()}/${row.completedAt.getFullYear()}`}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    {filteredData ? (
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        No scores found for this combination
                      </Typography>
                    ) : (
                      <CircularProgress />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Leaderboard;
