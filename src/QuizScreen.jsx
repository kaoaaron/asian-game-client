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
import "./colors.css";

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

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

const ColoredButton = styled(Button)(({ answerStatus }) => ({
  transition: "background-color 0.3s ease-in-out",
  backgroundColor:
    answerStatus === "correct"
      ? "#4caf50"
      : answerStatus === "wrong"
      ? "#f44336"
      : "var(--primary-gold)",
  color: "white",
  flex: 1,
  height: "100%",
  "&:hover": {
    backgroundColor:
      answerStatus === "correct"
        ? "darkgreen"
        : answerStatus === "wrong"
        ? "darkred"
        : "var(--light-gold)",
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

  const handleCompleteQuiz = async () => {
    await fetch(`${process.env.REACT_APP_ASIAN_API_URL}/increment-games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  if (currentPersonIndex >= totalQuestions) {
    handleCompleteQuiz();
    return (
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Quiz Complete!</Typography>
        <Typography variant="h6">
          Your Score: {score}/{totalQuestions} ({scorePercentage}%)
        </Typography>
        <Button
          variant="contained"
          color="gold"
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
        color="gold"
        style={{
          height: 8,
          width: "100%",
          borderRadius: 5,
        }}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems="flex-start"
        sx={{ width: "100%", flex: 1 }}
      >
        <Box sx={{ flex: 2, width: "100%" }}>
          <Card
            sx={{
              height: { xs: "65vh", sm: "95vh" },
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
        <Stack
          sx={{
            flex: 1,
            height: "95vh",
            display: "flex",
            flexDirection: "column",
            paddingRight: { xs: "0", sm: "16px" },
            width: "100%",
          }}
        >
          <Box
            sx={{
              height: "50vh",
              backgroundColor: "#f5f5f5",
              textAlign: "center",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              padding: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            {selectedOption && (
              <>
                <Typography variant="h4" color="text.primary">
                  {currentPerson.nativeName || currentPerson.name}
                </Typography>
                {currentPerson.nativeName && (
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    English Name: {currentPerson.name}
                  </Typography>
                )}
                {currentPerson.shortDescription && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Description: {currentPerson.shortDescription}
                  </Typography>
                )}
                {currentPerson.birthDate && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Age: {calculateAge(currentPerson.birthDate)}
                  </Typography>
                )}
                {currentPerson.birthPlaceLabel && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Birthplace: {currentPerson.birthPlaceLabel}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ marginTop: "8px" }}
                >
                  Occupation: {currentPerson.occupation}
                </Typography>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { sm: "1fr", md: "1fr 1fr" },
              gap: 1,
              width: "100%",
              flex: 1,
              marginTop: { xs: 0, sm: 1 },
              height: "auto",
            }}
          >
            {options.map((option) => (
              <ColoredButton
                key={option}
                variant="contained"
                answerStatus={
                  selectedOption === option && isCorrect
                    ? "correct"
                    : selectedOption === option && !isCorrect
                    ? "wrong"
                    : selectedOption && option === currentPerson.ethnicity
                    ? "correct"
                    : null
                }
                onClick={() => handleOptionClick(option)}
                style={{
                  fontSize: "clamp(0.5rem, 1rem, 1.5rem)",
                  pointerEvents: isDisabled ? "none" : "auto",
                  flex: 1,
                  height: "100%",
                }}
              >
                {option}
              </ColoredButton>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default QuizScreen;
