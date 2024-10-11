import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const ethnicities = [
  "Chinese",
  "Korean",
  "Japanese",
  "Indonesian",
  "Malaysian",
  "Filipino",
  "Thai",
  "Vietnamese",
];

const QuizScreen = ({ people, onBack }) => {
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const totalQuestions = people.length;

  const currentPerson = people[currentPersonIndex];

  useEffect(() => {
    if (currentPerson) {
      generateOptions(currentPerson.ethnicity);
    }
  }, [currentPerson]);

  const generateOptions = (correctEthnicity) => {
    const wrongOptions = ethnicities
      .filter((ethnicity) => ethnicity !== correctEthnicity)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [...wrongOptions, correctEthnicity].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === currentPerson.ethnicity) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextPerson = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentPersonIndex(currentPersonIndex + 1);
  };

  const scorePercentage =
    totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  if (currentPersonIndex >= totalQuestions) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        justifyContent="center"
        style={{ minHeight: "100vh", overflow: "hidden" }}
      >
        <Typography variant="h5">Quiz Complete!</Typography>
        <Typography variant="h6">
          Your Score: {score}/{totalQuestions} ({scorePercentage}%)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onBack}
          style={{ marginTop: "16px" }}
        >
          Back to Start Game
        </Button>
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={2}
      justifyContent="center"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            image={currentPerson.imageUrl}
            alt={currentPerson.name}
            style={{ objectFit: "contain", height: "600px", width: "100%" }}
          />
          <CardContent style={{ height: "100px" }}>
            {selectedOption && (
              <>
                <Typography variant="h6">{currentPerson.name}</Typography>
                <Typography variant="body1">
                  Occupation: {currentPerson.occupation}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item container spacing={2} justifyContent="center">
        {options.map((option) => (
          <Grid item xs={6} sm={3} key={option}>
            <Button
              variant="contained"
              color={selectedOption === option ? "secondary" : "primary"}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption}
              style={{ width: "100%", padding: "16px", fontSize: "16px" }}
            >
              {option}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid
        item
        style={{
          minHeight: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {selectedOption && (
          <>
            <Typography variant="h6">
              {isCorrect
                ? "Correct!"
                : `Wrong! The correct answer was ${currentPerson.ethnicity}.`}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPerson}
            >
              Next
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default QuizScreen;
