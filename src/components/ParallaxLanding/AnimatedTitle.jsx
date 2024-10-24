import React from "react";
import styled, { keyframes } from "styled-components";
import "../../fonts.css"; // Ensure the path is correct

// Pulsing scale effect with rotation
const fancyAnimation = keyframes`
  0% {
    transform: scale(0.5) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(3deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const Title = styled.h1`
  position: absolute;
  top: 5%;
  right: 5%;
  font-size: 3.5rem;
  font-weight: bold;
  font-family: "Chokokutai"; /* Ensure the font is loaded */
  background: linear-gradient(45deg, #ff0000, #ff7f7f, #ff6347);
  background-clip: text;
  -webkit-background-clip: text; /* For WebKit browsers */
  color: transparent; /* Make the gradient visible */
  animation: ${fancyAnimation} 2s ease-in-out forwards; /* Animation occurs once */
  text-align: center;
  margin: 0;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2); /* Enlarges on hover for added effect */
  }
`;

const AnimatedTitle = () => {
  return <Title>Guess the Asian Ethnicity</Title>;
};

export default AnimatedTitle;
