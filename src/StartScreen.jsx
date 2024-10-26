import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Arrange children in a column */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent scrolling */
  background-color: black; /* Set background to black */
`;

const Image = styled.img`
  width: 100%; /* Full width */
  max-width: 600px; /* Max width for the image */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 16px; /* Spacing below the image */
  border-radius: 15px; /* Rounded corners */
  cursor: pointer; /* Change cursor on hover */
`;

const StyledButton = styled(Button)`
  width: 100%; /* Full width */
  max-width: 400px; /* Optional: max width for the buttons */
  margin: 8px 0; /* Add vertical margin to space out buttons */
  padding: 16px; /* Increase button size */
  font-size: 18px; /* Increase font size for better visibility */
`;

const Title = styled(Typography)`
  color: #3f51b5;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px; /* Move the title higher with more spacing */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const StartScreen = ({ onSinglePlayerClick }) => {
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

export default StartScreen;
