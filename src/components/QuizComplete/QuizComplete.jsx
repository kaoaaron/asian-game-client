import React, { useState, useEffect } from "react";
import { Stack, Button, Typography } from "@mui/material";
import DiscoverPeopleModal from "../DiscoverPeopleModal.jsx/DiscoverPeopleModal";
import { fetchLeaderboardAvailability } from "../../api";
import LeaderboardFormModal from "./LeaderboardFormModal";
import { useNavigate } from "react-router";
import useQuizStore from "../../store";

const QuizComplete = ({ score, totalQuestions, scorePercentage, onBack }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLBModalOpen, setIsLBModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseLBModal = () => setIsLBModalOpen(false);
  const handleViewLeaderboard = () => navigate("/leaderboard");
  const leaderboardQualified = useQuizStore(
    (state) => state.leaderboardQualified
  );

  useEffect(() => {
    async function fetchData() {
      const res = await fetchLeaderboardAvailability({
        scored: score,
        total: totalQuestions,
      });
      if (res) {
        setIsLBModalOpen(true);
      }
    }
    if (leaderboardQualified) {
      fetchData();
    }
  }, []);

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
        <Button
          variant="contained"
          color="gold"
          onClick={handleViewLeaderboard}
          sx={{ marginTop: "16px" }}
        >
          View Leaderboard
        </Button>
      </Stack>

      <DiscoverPeopleModal open={isModalOpen} onClose={handleCloseModal} />
      <LeaderboardFormModal
        open={isLBModalOpen}
        onClose={handleCloseLBModal}
        scored={score}
        total={totalQuestions}
      />
    </>
  );
};

export default QuizComplete;
