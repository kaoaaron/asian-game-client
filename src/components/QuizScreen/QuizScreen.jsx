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
  CircularProgress,
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
  const timerDisabled = useQuizStore((state) => state.timerDisabled);
  const timerActive = useQuizStore((state) => state.timerActive);
  const setTimerActive = useQuizStore((state) => state.setTimerActive);
  const timeRemaining = useQuizStore((state) => state.timeRemaining);
  const setTimeRemaining = useQuizStore((state) => state.setTimeRemaining);
  const resetTimer = useQuizStore((state) => state.resetTimer);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [correctPersonIndex, setCorrectPersonIndex] = useState(null);

  const isNewMode = filters.mode === "New";
  console.log(isNewMode, "asd2");
  const totalQuestions = people.length;
  const currentQuestion = people[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timerDisabled || hasAnswered || currentQuestionIndex >= totalQuestions) return;

    if (currentQuestion && !timerActive) {
      setTimerActive(true);
      setTimeRemaining(12);
      setTimerExpired(false);
      setCorrectPersonIndex(null);
    }

    if (timerActive && timeRemaining > 0 && !timerExpired) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timerActive && timeRemaining === 0 && !timerExpired) {
      // Time's up - show correct answer and move to next question
      setTimerActive(false);
      setHasAnswered(true);
      setIsDisabled(true);
      setTimerExpired(true);
      setTimeRemaining(0); // Keep at 0

      // Find the correct person index safely
      let correctIndex = null;
      if (currentQuestion && Array.isArray(currentQuestion.people)) {
        correctIndex = currentQuestion.people.findIndex(
          person => person.ethnicity === currentQuestion.correctEthnicity
        );
      }
      setCorrectPersonIndex(correctIndex);

      // Add incorrect guess since they didn't answer in time
      if (isNewMode && currentQuestion && currentQuestion.people && currentQuestion.people[0]) {
        addIncorrectGuess(currentQuestion.people[0]._id); // Add first person as incorrect
      } else if (currentQuestion) {
        addIncorrectGuess(currentQuestion._id);
        // Set selectedOption to correct answer in Classic Mode
        setSelectedOption(currentQuestion.ethnicity);
      }

      setTimeout(() => {
        setIsDisabled(false);
        handleNextQuestion();
      }, 2000);
    }
  }, [timerActive, timeRemaining, currentQuestion, timerDisabled, hasAnswered, isNewMode, setTimerActive, setTimeRemaining, addIncorrectGuess, timerExpired, currentQuestionIndex, totalQuestions]);

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
    if (isDisabled || hasAnswered) return;

    setSelectedOption(option);
    setHasAnswered(true);
    setIsDisabled(true);
    setTimerActive(false);

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
    if (isDisabled || hasAnswered) return;

    setSelectedImageIndex(index);
    setHasAnswered(true);
    setIsDisabled(true);
    setTimerActive(false);

    // Always set correctPersonIndex to the correct person
    const correctIndex = currentQuestion.people.findIndex(
      person => person.ethnicity === currentQuestion.correctEthnicity
    );
    setCorrectPersonIndex(correctIndex);

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
    setHasAnswered(false);
    setTimerExpired(false);
    setCorrectPersonIndex(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    resetTimer();
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
        totalQuestions={totalQuestions}
        scorePercentage={scorePercentage}
        onBack={onBack}
      />
    );
  }

  // Timer display component
  const TimerDisplay = () => {
    if (timerDisabled) return null;
    
    return (
      <Box
        sx={{
          position: "absolute",
          top: 48,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "8px 12px",
          borderRadius: "20px",
          zIndex: 10,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={(timeRemaining / 12) * 100}
          size={24}
          sx={{
            color: timeRemaining <= 3 ? "#f44336" : timeRemaining <= 6 ? "#ff9800" : "#4caf50",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {timeRemaining}
        </Typography>
      </Box>
    );
  };

  // Timer display for Classic Mode (positioned on white box)
  const ClassicTimerDisplay = () => {
    if (timerDisabled) return null;
    
    return (
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "6px 10px",
          borderRadius: "16px",
          zIndex: 10,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={(timeRemaining / 12) * 100}
          size={20}
          sx={{
            color: timeRemaining <= 3 ? "#f44336" : timeRemaining <= 6 ? "#ff9800" : "#4caf50",
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: "white",
            fontWeight: "bold",
            minWidth: "16px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {timeRemaining}
        </Typography>
      </Box>
    );
  };

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
          position: "relative",
        }}
      >
        <TimerDisplay />
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
                  (isDisabled || timerExpired) &&
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

        {/* Always show the info popup if timerExpired and correctPersonIndex is set, or if user has selected */}
        {((timerExpired && correctPersonIndex !== null) || (selectedImageIndex !== null && correctPersonIndex !== null)) && (
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
              zIndex: 20,
            }}
          >
            {(() => {
              const idx = correctPersonIndex;
              if (idx === null || !currentQuestion.people[idx]) return null;
              const person = currentQuestion.people[idx];
              return (
                <>
                  <Typography color="white" variant="h6" align="center">
                    {person.nativeName || person.name}
                  </Typography>
                  {person.nativeName && (
                    <Typography color="white" align="center">
                      English Name: {person.name}
                    </Typography>
                  )}
                  {person.shortDescription && (
                    <Typography color="white" align="center">
                      Description: {person.shortDescription}
                    </Typography>
                  )}
                  {person.birthDate && (
                    <Typography color="white" align="center">
                      Age: {calculateAge(person.birthDate)}
                    </Typography>
                  )}
                  {person.birthPlaceLabel && (
                    <Typography color="white" align="center">
                      Birthplace: {person.birthPlaceLabel}
                    </Typography>
                  )}
                  {person.occupation && (
                    <Typography color="white" align="center">
                      Occupation: {person.occupation}
                    </Typography>
                  )}
                </>
              );
            })()}
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
        position: "relative",
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
              position: "relative",
            }}
          >
            <ClassicTimerDisplay />
            {(selectedOption || timerExpired) && (
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
                    : timerExpired && option === currentQuestion.ethnicity
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
