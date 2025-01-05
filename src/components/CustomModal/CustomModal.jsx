import React from "react";
import { Modal, Box, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
          <Typography id="modal-title" variant="h6">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {children}
        </Typography>
      </Box>
    </Modal>
  );
};

export default CustomModal;
