import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";
import TextSection from "../ParallaxLanding/TextSection";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const ContentContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const Title = styled(Typography)`
  color: #3f51b5;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 15px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 16px;
  font-size: 18px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
      <ContentContainer>
        <Title variant="h3" color="gold">
          Guess the Asian Ethnicity
        </Title>
        <Image
          src={imageSrc}
          alt="Single Player and Multiplayer"
          onClick={handleImageClick}
        />
        <ButtonsContainer>
          <StyledButton
            variant="contained"
            color="gold"
            onClick={onSinglePlayerClick}
          >
            Single Player
          </StyledButton>
          <StyledButton variant="contained" color="gold" disabled>
            Play with Friends
          </StyledButton>
        </ButtonsContainer>
      </ContentContainer>
      <TextSection />
    </Container>
  );
};

export default MobileStartScreen;
