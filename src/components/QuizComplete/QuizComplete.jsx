import React, { useState } from "react";
import { Stack, Button, Typography } from "@mui/material";
import DiscoverPeopleModal from "../DiscoverPeopleModal.jsx/DiscoverPeopleModal";

const QuizComplete = ({ score, totalQuestions, scorePercentage, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "white" }}>
          Quiz Complete!
        </Typography>
        <Typography variant="h6" sx={{ color: "white" }}>
          Your Score: {score}/{totalQuestions} ({scorePercentage}%)
        </Typography>
        <Button
          variant="contained"
          color="gold"
          onClick={handleOpenModal}
          sx={{ marginTop: "16px" }}
        >
          Discover People
        </Button>
        <Button
          variant="contained"
          color="gold"
          onClick={onBack}
          sx={{ marginTop: "16px" }}
        >
          Back to Start Game
        </Button>
      </Stack>

      <DiscoverPeopleModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default QuizComplete;
