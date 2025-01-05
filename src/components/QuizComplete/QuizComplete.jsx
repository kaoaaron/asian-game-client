import React, { useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

      {/* Modal Component */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="discover-people-modal"
        aria-describedby="modal-for-discover-people"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="discover-people-modal" variant="h6">
              Discover People
            </Typography>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography sx={{ mt: 2 }}>
            Here, you can add content about discovering people or any other
            relevant details you want to display in the modal.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default QuizComplete;
