import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Typography,
  Card,
  CardMedia,
  Box,
  LinearProgress,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import "../../colors.css";
import QuizComplete from "../QuizComplete/QuizComplete";
import useQuizStore from "../../store";

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

const StyledCard = styled(Card)(({ selected, correct, wrong }) => ({
  cursor: "pointer",
  transition: "transform 0.2s, border 0.2s",
  border: "4px solid transparent",
  height: "100%",
  display: "flex",
  "&:hover": {
    transform: "scale(1.02)",
  },
  ...(selected && {
    border: `4px solid ${correct ? "#4caf50" : "#f44336"}`,
  }),
  ...(correct &&
    !selected && {
      border: "4px solid #4caf50",
    }),
}));

const QuizScreen = ({ onBack }) => {
  const people = useQuizStore((state) => state.people);
  const filters = useQuizStore((state) => state.filters);
  const addIncorrectGuess = useQuizStore((state) => state.addIncorrectGuess);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const isNewMode = filters.mode === "New";
  const totalQuestions = people.length;
  const currentQuestion = people[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion && !isNewMode) {
      generateOptions(currentQuestion.ethnicity);
    }
  }, [currentQuestion, isNewMode]);

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

  const handleClassicModeSelection = (option) => {
    if (isDisabled) return;

    setSelectedOption(option);
    setIsDisabled(true);

    const correct = option === currentQuestion.ethnicity;
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    } else {
      addIncorrectGuess(currentQuestion._id);
    }

    setTimeout(() => {
      setIsDisabled(false);
      handleNextQuestion();
    }, 2000);
  };

  const handleNewModeSelection = (index) => {
    if (isDisabled) return;

    setSelectedImageIndex(index);
    setIsDisabled(true);

    const correct =
      currentQuestion.people[index].ethnicity ===
      currentQuestion.correctEthnicity;
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    } else {
      addIncorrectGuess(currentQuestion.people[index]._id);
    }

    setTimeout(() => {
      setIsDisabled(false);
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    setSelectedImageIndex(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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

  if (currentQuestionIndex >= totalQuestions) {
    handleCompleteQuiz();
    return (
      <QuizComplete
        score={score}
        mode={isNewMode ? "new" : "classic"}
        totalQuestions={totalQuestions}
        scorePercentage={scorePercentage}
        onBack={onBack}
      />
    );
  }

  if (isNewMode) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          height: "100vh",
          p: 2,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={Math.floor((currentQuestionIndex / totalQuestions) * 100)}
          color="gold"
          sx={{ height: 8, borderRadius: 5, width: "100%" }}
        />

        <Typography variant="h5" color="white" align="center">
          Select the {currentQuestion.correctEthnicity} person
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            height: "calc(100vh)",
            alignContent: "center",
            maxWidth: "calc(100vh - 150px)",
            margin: "0 auto",
            aspectRatio: "1",
            width: "100%",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          {currentQuestion.people.map((person, index) => (
            <Box
              key={person._id}
              sx={{
                position: "relative",
                aspectRatio: "1",
                width: "100%",
                maxWidth: "calc((100vh - 150px) / 2 - 8px)",
              }}
            >
              <StyledCard
                onClick={() => handleNewModeSelection(index)}
                selected={selectedImageIndex === index}
                correct={
                  isDisabled &&
                  person.ethnicity === currentQuestion.correctEthnicity
                }
                wrong={selectedImageIndex === index && !isCorrect}
              >
                <CardMedia
                  component="img"
                  image={person.imageUrl}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
              </StyledCard>
            </Box>
          ))}
        </Box>

        {selectedImageIndex !== null && (
          <Box
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.8)",
              p: 2,
              borderRadius: 2,
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "90%",
              width: "auto",
            }}
          >
            <Typography color="white" variant="h6" align="center">
              {currentQuestion.people[selectedImageIndex].nativeName ||
                currentQuestion.people[selectedImageIndex].name}
            </Typography>
            {currentQuestion.people[selectedImageIndex].occupation && (
              <Typography color="white" align="center">
                Occupation:{" "}
                {currentQuestion.people[selectedImageIndex].occupation}
              </Typography>
            )}
          </Box>
        )}
      </Stack>
    );
  }

  // Classic Mode
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
        value={Math.floor((currentQuestionIndex / totalQuestions) * 100)}
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
              image={currentQuestion.imageUrl}
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
                  {currentQuestion.nativeName || currentQuestion.name}
                </Typography>
                {currentQuestion.nativeName && (
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    English Name: {currentQuestion.name}
                  </Typography>
                )}
                {currentQuestion.shortDescription && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Description: {currentQuestion.shortDescription}
                  </Typography>
                )}
                {currentQuestion.birthDate && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Age: {calculateAge(currentQuestion.birthDate)}
                  </Typography>
                )}
                {currentQuestion.birthPlaceLabel && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ marginTop: "8px" }}
                  >
                    Birthplace: {currentQuestion.birthPlaceLabel}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ marginTop: "8px" }}
                >
                  Occupation: {currentQuestion.occupation}
                </Typography>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
                    : selectedOption && option === currentQuestion.ethnicity
                    ? "correct"
                    : null
                }
                onClick={() => handleClassicModeSelection(option)}
                style={{
                  fontSize: {
                    xs: "clamp(0.5rem, 1rem, 1.5rem)",
                    sm: "clamp(0.5rem, 2vw, 1.5rem)",
                  },
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
