import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-color: black;
`;

const Image = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  margin-bottom: 16px;
  border-radius: 15px;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 400px;
  margin: 8px 0;
  padding: 16px;
  font-size: 18px;
`;

const Title = styled(Typography)`
  color: #3f51b5;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const MobileStartScreen = ({ onSinglePlayerClick }) => {
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

  return (
    <Container>
      <Title variant="h3">Guess the Asian</Title>
      <Image
        src={imageSrc}
        alt="Single Player and Multiplayer"
        onClick={handleImageClick}
      />
      <StyledButton
        variant="contained"
        color="primary"
        onClick={onSinglePlayerClick}
      >
        Single Player
      </StyledButton>
      <StyledButton variant="contained" color="primary" disabled>
        Play with Friends
      </StyledButton>
    </Container>
  );
};

export default MobileStartScreen;
