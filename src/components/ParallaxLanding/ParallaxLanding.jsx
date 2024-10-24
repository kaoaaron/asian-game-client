import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import background from "../../assets/images/landing/background.png";
import foregroundtrees from "../../assets/images/landing/foregroundtrees.png";
import asiansign from "../../assets/images/landing/asiansign.png";
import playsign from "../../assets/images/landing/playsign.png";
import playsignhover from "../../assets/images/landing/playsignhover.png";
import rooftop from "../../assets/images/landing/rooftop.png";
import dooropen from "../../assets/images/landing/dooropen.png";
import backtree from "../../assets/images/landing/backtree.png";
import panda from "../../assets/images/landing/panda.png";
import jiyoung from "../../assets/images/landing/jiyoung.png";

const zoomIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(15);
  }
`;

const ImageContainer = styled.div`
  height: 100vh;
  background: black;
  position: relative;
  overflow: hidden;
  animation: ${({ zoom }) =>
    zoom
      ? css`
          ${zoomIn} 3s forwards
        `
      : "none"};

  & img {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #jiyoung {
    z-index: 1;
    transform: rotate(30deg);
    top: -320px;
    right: -800px;
  }

  #rooftop {
    z-index: 2;
  }

  #panda {
    z-index: 3;
  }

  #playsign {
    z-index: 4;
  }

  #playsignhover {
    z-index: 5;
    display: block; /* Always display when condition met */
  }

  #hover-trigger {
    position: absolute;
    top: 85%;
    left: 55%;
    width: 15vw;
    height: 14vh;
    z-index: 6;
    cursor: pointer;
  }

  #door-black-div {
    position: absolute;
    top: 60%;
    left: 65%;
    width: 8vw;
    height: 13vh;
    z-index: 7;
  }
`;

const ParallaxLanding = ({ onZoomComplete }) => {
  const [hovered, setHovered] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("0% 0%");
  const [doorOpened, setDoorOpened] = useState(false);
  const doorRef = useRef(null);

  const handleClick = () => {
    if (doorRef.current) {
      const { top, left, width, height } =
        doorRef.current.getBoundingClientRect();
      const originX = left + width / 2 + 35;
      const originY = top + height / 2;
      setTransformOrigin(`${originX}px ${originY}px`);
      setZoomed(true);
      setDoorOpened(true);
    }
  };

  useEffect(() => {
    if (zoomed) {
      const timer = setTimeout(() => {
        onZoomComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [zoomed, onZoomComplete]);

  return (
    <ImageContainer zoom={zoomed} style={{ transformOrigin }}>
      <img src={background} alt="Background" />
      <img src={foregroundtrees} alt="Foreground Trees" />
      <img id="panda" src={asiansign} alt="Asian Sign" />
      <img id="playsign" src={playsign} alt="Play Sign" />
      <div
        id="hover-trigger"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      />
      {hovered && (
        <img id="playsignhover" src={playsignhover} alt="Play Sign Hover" />
      )}
      {hovered && <div id="door-black-div" ref={doorRef} />}
      {(doorOpened || hovered) && (
        <img src={dooropen} id="panda" alt="Door Open" />
      )}
      <img id="rooftop" src={rooftop} alt="Rooftop" />
      <img src={backtree} alt="Back Tree" />
      <img id="panda" src={panda} alt="Panda" />
      {false && <img id="jiyoung" src={jiyoung} alt="Jiyoung" />}
    </ImageContainer>
  );
};

export default ParallaxLanding;
