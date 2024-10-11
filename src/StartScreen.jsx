import React, { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";

const StartScreen = ({ onSinglePlayerClick }) => {
  const [clickCount, setClickCount] = useState(0);
  const [imageSrc, setImageSrc] = useState(
    "https://i.ibb.co/94k5vSW/1451055694065.jpg"
  );

  const handleImageClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 20) {
        setImageSrc(
          "https://i.ibb.co/TtcV9C6/Screenshot-2024-10-11-at-4-00-08-PM.png"
        );
      }
      return newCount;
    });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Grid item>
        <Typography
          variant="h3"
          style={{
            color: "#3f51b5",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Guess the Asian
        </Typography>
      </Grid>
      <Grid item>
        <img
          src={imageSrc}
          alt="Single Player and Multiplayer"
          onClick={handleImageClick}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            marginBottom: "16px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onSinglePlayerClick}
        >
          Single Player
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" disabled>
          Play with Friends
        </Button>
      </Grid>
    </Grid>
  );
};

export default StartScreen;
