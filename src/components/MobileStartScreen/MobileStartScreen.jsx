import React, { useState } from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";
import TextSection from "../ParallaxLanding/TextSection";

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 16px",
  background: "#1a1a1a",
  position: "relative",
  overflow: "hidden",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: "#ffd700",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "32px",
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  fontSize: "2.5rem",
  zIndex: 1,
  position: "relative",
}));

const StyledImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  height: "auto",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  marginBottom: "32px",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  zIndex: 1,
  position: "relative",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  background: variant === "primary" 
    ? "linear-gradient(45deg, #ffd700 30%, #ffed4e 90%)"
    : variant === "secondary"
    ? "linear-gradient(45deg, #4a4a4a 30%, #666666 90%)"
    : "linear-gradient(45deg, #4ecdc4 30%, #44a08d 90%)",
  borderRadius: "25px",
  border: "none",
  color: variant === "secondary" ? "#ffffff" : "#000000",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "16px 32px",
  boxShadow: "0 8px 15px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  textTransform: "none",
  width: "100%",
  maxWidth: "300px",
  marginBottom: "16px",
  zIndex: 1,
  position: "relative",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
  "&:disabled": {
    background: "linear-gradient(45deg, #cccccc 30%, #dddddd 90%)",
    color: "#666666",
    transform: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "300px",
  zIndex: 1,
  position: "relative",
}));

const MobileStartScreen = ({ onSinglePlayerClick }) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [imageSrc, setImageSrc] = useState(
    "https://i.ibb.co/LQz6XdB/Screenshot-2024-10-11-at-4-10-53-PM.png"
  );

  const handleImageClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 20) {
        setImageSrc(
          "https://i.ibb.co/dt8FdzL/Screenshot-2024-10-11-at-4-13-23-PM.png"
        );
      }
      return newCount;
    });
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  return (
    <StyledContainer maxWidth="sm">
      <Title variant="h2">
        Guess the Asian Ethnicity
      </Title>
      
      <StyledImage
        src={imageSrc}
        alt="Single Player and Multiplayer"
        onClick={handleImageClick}
      />
      
      <ButtonsContainer>
        <ActionButton
          variant="primary"
          onClick={onSinglePlayerClick}
        >
          🎮 Play Game
        </ActionButton>
        
        <ActionButton
          variant="secondary"
          onClick={handleLeaderboardClick}
        >
          🏆 View Leaderboard
        </ActionButton>
      </ButtonsContainer>
      
      <TextSection />
    </StyledContainer>
  );
};

export default MobileStartScreen;
