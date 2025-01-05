import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CustomModal from "../CustomModal/CustomModal";
import { saveLeaderboardData } from "../../api";

const LeaderboardFormModal = ({ open, onClose, scored, total }) => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleOnConfirm = async () => {
    const res = await saveLeaderboardData({
      name,
      scored,
      total,
    });
    if (res.result) {
      onClose();
    } else {
      setErrMsg(res.msg);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Add yourself to the Leaderboard🎉"
    >
      <Typography variant="body2">{`You scored ${scored} out of ${total}!`}</Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "0 auto",
          mt: 4,
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText={errMsg}
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOnConfirm}
            fullWidth
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default LeaderboardFormModal;
