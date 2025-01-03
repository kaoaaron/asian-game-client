import React, { useState } from "react";
import { Container, Box, useMediaQuery, CssBaseline } from "@mui/material";
import MobileStartScreen from "./components/MobileStartScreen/MobileStartScreen";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import QuizScreen from "./components/QuizScreen/QuizScreen";
import ParallaxLanding from "./components/ParallaxLanding/ParallaxLanding";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fetchPeopleData } from "./api";

const ScreenEnum = {
  START: "start",
  FILTERS: "filters",
  QUIZ: "quiz",
};

const theme = createTheme({
  palette: {
    background: {
      default: "#000000",
    },
    text: {
      primary: "#000000",
    },
    gold: {
      main: getComputedStyle(document.documentElement).getPropertyValue(
        "--primary-gold"
      ),
      light: getComputedStyle(document.documentElement).getPropertyValue(
        "--light-gold"
      ),
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          overflowX: "hidden",
        },
      },
    },
  },
});

const App = () => {
  const [screen, setScreen] = useState(ScreenEnum.START);
  const [filters, setFilters] = useState({
    numberOfPeople: 30,
    gender: "both",
  });
  const [people, setPeople] = useState([]);
  const [zoomFinished, setZoomFinished] = useState(false);

  const isMobile = useMediaQuery("(max-width:980px)");

  const handleStartSinglePlayer = () => {
    setScreen(ScreenEnum.FILTERS);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartQuiz = async () => {
    const data = await fetchPeopleData(filters);
    setPeople(data);
    setScreen(ScreenEnum.QUIZ);
  };

  const handleBackToStart = () => {
    setZoomFinished(false);
    setScreen(ScreenEnum.START);
  };

  const renderDesktop = () =>
    zoomFinished ? (
      <Box>
        {screen === ScreenEnum.FILTERS ? (
          <FilterOptions
            filters={filters}
            onFilterChange={handleFilterChange}
            onStartQuiz={handleStartQuiz}
          />
        ) : screen === ScreenEnum.QUIZ ? (
          <QuizScreen people={people} onBack={handleBackToStart} />
        ) : null}
      </Box>
    ) : (
      <ParallaxLanding
        onZoomComplete={() => {
          setZoomFinished(true);
          setScreen(ScreenEnum.FILTERS);
        }}
      />
    );

  const renderMobile = () => (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        {screen === ScreenEnum.START && (
          <MobileStartScreen onSinglePlayerClick={handleStartSinglePlayer} />
        )}
        {screen === ScreenEnum.FILTERS && (
          <FilterOptions
            filters={filters}
            onFilterChange={handleFilterChange}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {screen === ScreenEnum.QUIZ && (
          <QuizScreen people={people} onBack={handleBackToStart} />
        )}
      </Box>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMobile ? renderMobile() : renderDesktop()}
    </ThemeProvider>
  );
};

export default App;
