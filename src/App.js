import React from "react";
import { Container, Box, useMediaQuery, CssBaseline } from "@mui/material";
import MobileStartScreen from "./components/MobileStartScreen/MobileStartScreen";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import QuizScreen from "./components/QuizScreen/QuizScreen";
import ParallaxLanding from "./components/ParallaxLanding/ParallaxLanding";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fetchPeopleData } from "./api";
import useQuizStore, { ScreenEnum } from "./store";

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
  const isMobile = useMediaQuery("(max-width:980px)");

  const screen = useQuizStore((state) => state.screen);
  const setScreen = useQuizStore((state) => state.setScreen);
  const filters = useQuizStore((state) => state.filters);
  const setFilters = useQuizStore((state) => state.setFilters);
  const zoomFinished = useQuizStore((state) => state.zoomFinished);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const setPeople = useQuizStore((state) => state.setPeople);
  const resetToStart = useQuizStore((state) => state.resetToStart);
  const setLeaderboardQualified = useQuizStore(
    (state) => state.setLeaderboardQualified
  );
  const handleStartSinglePlayer = () => {
    setLeaderboardQualified(true);
    setScreen(ScreenEnum.FILTERS);
  };

  const handleFilterChange = (e) => {
    setFilters({
      [e.target.name]: e.target.value,
    });
  };

  const handleStartQuiz = async () => {
    const data = await fetchPeopleData(filters);
    setPeople(data);
    setScreen(ScreenEnum.QUIZ);
  };

  if (screen === ScreenEnum.QUIZ) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            ...(isMobile && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              padding: "0 16px",
              maxWidth: "600px",
              margin: "0 auto",
            }),
          }}
        >
          <QuizScreen onBack={resetToStart} />
        </Box>
      </ThemeProvider>
    );
  }

  const renderDesktop = () =>
    zoomFinished ? (
      <Box>
        {screen === ScreenEnum.FILTERS && (
          <FilterOptions
            filters={filters}
            onFilterChange={handleFilterChange}
            onStartQuiz={handleStartQuiz}
          />
        )}
      </Box>
    ) : (
      <ParallaxLanding
        onZoomComplete={() => {
          setZoomFinished(true);
          setLeaderboardQualified(true);
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
