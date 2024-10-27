import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Typography,
  Card,
  CardMedia,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";

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

const ColoredButton = styled(Button)(({ answerStatus }) => ({
  transition: "background-color 0.3s ease-in-out",
  backgroundColor:
    answerStatus === "correct"
      ? "green"
      : answerStatus === "wrong"
      ? "red"
      : "navyblue",
  color: "white",
  flex: 1,
  height: "100%",
  "&:hover": {
    backgroundColor:
      answerStatus === "correct"
        ? "darkgreen"
        : answerStatus === "wrong"
        ? "darkred"
        : "blue",
  },
}));

const QuizScreen = ({ people, onBack }) => {
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
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
    if (isDisabled) return;

    setSelectedOption(option);
    setIsDisabled(true);

    if (option === currentPerson.ethnicity) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      setIsDisabled(false);
      handleNextPerson();
    }, 2000);
  };

  const handleNextPerson = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    setCurrentPersonIndex((prevIndex) => prevIndex + 1);
  };

  const scorePercentage =
    totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  if (currentPersonIndex >= totalQuestions) {
    return (
      <Stack spacing={2} alignItems="center">
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
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      alignItems="center"
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={Math.floor((currentPersonIndex / totalQuestions) * 100)}
        style={{ height: 8, width: "100%", borderRadius: 5 }}
      />
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        <Box sx={{ flex: 2 }}>
          <Card
            sx={{
              height: { xs: "65vh", sm: "80vh" },
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={currentPerson.imageUrl}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Card>
        </Box>
        <Box
          sx={{
            flex: 1,
            height: "50vh",
            backgroundColor: "#f5f5f5",
            textAlign: "center",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {selectedOption && (
            <>
              <Typography variant="h6" color="text.primary">
                {currentPerson.name}
              </Typography>
              <Typography variant="body1" color="text.primary">
                Occupation: {currentPerson.occupation}
              </Typography>
            </>
          )}
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ width: "100%", flex: 1 }}
      >
        {options.map((option) => (
          <Stack
            key={option}
            sx={{
              flex: { xs: 1, sm: 0.5 },
              height: { xs: "calc(100vh / 5 - 8px)", sm: "100%" },
            }}
          >
            <ColoredButton
              variant="contained"
              answerStatus={
                selectedOption === option && isCorrect
                  ? "correct"
                  : selectedOption === option &&
                    !isCorrect &&
                    option === selectedOption
                  ? "wrong"
                  : selectedOption && option === currentPerson.ethnicity
                  ? "correct"
                  : null
              }
              onClick={() => handleOptionClick(option)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "1rem",
                pointerEvents: isDisabled ? "none" : "auto",
              }}
            >
              {option}
            </ColoredButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default QuizScreen;
