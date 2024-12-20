import React, { useState } from "react";
import { Container, Box, useMediaQuery } from "@mui/material";
import MobileStartScreen from "./MobileStartScreen";
import FilterOptions from "./FilterOptions";
import QuizScreen from "./QuizScreen";
import ParallaxLanding from "./components/ParallaxLanding/ParallaxLanding";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    gold: {
      main: getComputedStyle(document.documentElement).getPropertyValue(
        "--primary-gold"
      ),
      light: getComputedStyle(document.documentElement).getPropertyValue(
        "--light-gold"
      ),
    },
  },
});

const App = () => {
  const [screen, setScreen] = useState("start");
  const [filters, setFilters] = useState({
    numberOfPeople: 30,
    gender: "both",
  });
  const [people, setPeople] = useState([]);
  const [zoomFinished, setZoomFinished] = useState(false);

  const handleStartSinglePlayer = () => {
    setScreen("filters");
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchPeopleData = async () => {
    const { numberOfPeople, gender } = filters;
    const genderFilter = gender === "both" ? "" : `&gender=${gender}`;
    const query = `/people?limit=${numberOfPeople}${genderFilter}`;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_ASIAN_API_URL}${query}`
      );
      const data = await response.json();
      setPeople(data);
      setScreen("quiz");
    } catch (error) {
      console.error("Error fetching people data:", error);
    }
  };

  const handleBackToStart = () => {
    setZoomFinished(false);
    setScreen("start");
  };

  const isMobile = useMediaQuery("(max-width:980px)");

  return (
    <ThemeProvider theme={theme}>
      <style>{`body { margin: 0; background-color: black; color: white;  }`}</style>{" "}
      {zoomFinished ? (
        <Box sx={{ width: "100%" }}>
          {screen === "filters" ? (
            <FilterOptions
              filters={filters}
              onFilterChange={handleFilterChange}
              onStartQuiz={fetchPeopleData}
            />
          ) : screen === "quiz" ? (
            <QuizScreen people={people} onBack={handleBackToStart} />
          ) : (
            <MobileStartScreen onSinglePlayerClick={handleStartSinglePlayer} />
          )}
        </Box>
      ) : isMobile ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            {screen === "start" && (
              <MobileStartScreen
                onSinglePlayerClick={handleStartSinglePlayer}
              />
            )}
            {screen === "filters" && (
              <FilterOptions
                filters={filters}
                onFilterChange={handleFilterChange}
                onStartQuiz={fetchPeopleData}
              />
            )}
            {screen === "quiz" && (
              <QuizScreen people={people} onBack={handleBackToStart} />
            )}
          </Box>
        </Container>
      ) : (
        <ParallaxLanding
          onZoomComplete={() => {
            setZoomFinished(true);
            setScreen("filters");
          }}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
