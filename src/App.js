import React, { useState } from "react";
import { Container, Box, useMediaQuery } from "@mui/material";
import StartScreen from "./StartScreen";
import FilterOptions from "./FilterOptions";
import QuizScreen from "./QuizScreen";
import ParallaxLanding from "./components/ParallaxLanding/ParallaxLanding";

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
      const response = await fetch(`https://api.guesstheasian.com${query}`);
      const data = await response.json();
      setPeople(data);
      setScreen("quiz");
    } catch (error) {
      console.error("Error fetching people data:", error);
    }
  };

  const handleBackToStart = () => {
    setScreen("start");
  };

  const isMobile = useMediaQuery("(max-width:980px)");

  return (
    <>
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
            <StartScreen onSinglePlayerClick={handleStartSinglePlayer} />
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
              <StartScreen onSinglePlayerClick={handleStartSinglePlayer} />
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
    </>
  );
};

export default App;
