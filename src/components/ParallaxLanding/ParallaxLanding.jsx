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
import embarassed from "../../assets/images/landing/embarassed.png";
import aaron from "../../assets/images/landing/aaron.png";
import AnimatedTitle from "./AnimatedTitle";

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
    display: block;
  }

  #playbuttondiv {
    position: absolute;
    top: 85%;
    left: 55%;
    width: 15vw;
    height: 14vh;
    z-index: 6;
    cursor: pointer;
  }

  #foregroundtreesdiv1 {
    position: absolute;
    bottom: 0%;
    left: 0%;
    width: 39vw;
    height: 26vh;
    z-index: 7;
    cursor: pointer;
  }

  #foregroundtreesdiv2 {
    position: absolute;
    bottom: 0%;
    left: 0%;
    width: 18vw;
    height: 90vh;
    z-index: 7;
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

  #foregroundtrees {
    z-index: 4;
  }

  #embarassed {
    z-index: 3;
    position: absolute;
    bottom: 0%;
    left: 0%;
    height: 30vw;
    width: auto;
  }

  #jiyoung {
    position: absolute;
    right: 16vw;
    top: ${({ hovered }) => (hovered ? "17vh" : "44vh")};
    width: 25vw;
    height: 40vh;
    transform-origin: bottom right;
    transform: rotate(25deg) translateX(-10%) translateY(10%);
    transition: top 1.5s ease-in-out; /* Smooth transition effect */
  }

  #aaron {
    position: absolute;
    right: 16vw;
    top: ${({ hovered }) => (hovered ? "17vh" : "44vh")};
    width: 25vw;
    height: 40vh;
    transform-origin: bottom right;
    transform: rotate(25deg) translateX(-10%) translateY(10%);
    transition: top 1.5s ease-in-out; /* Smooth transition effect */
  }
`;

const ParallaxLanding = ({ onZoomComplete }) => {
  const [hovered, setHovered] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("0% 0%");
  const [doorOpened, setDoorOpened] = useState(false);
  const [foregroundTreesClicks, setForegroundTreesClicks] = useState(0);
  const [showImages, setShowImages] = useState(false);
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

  const handleForegroundTreesClick = () => {
    setForegroundTreesClicks((prev) => prev + 1);
  };

  useEffect(() => {
    if (zoomed) {
      const timer = setTimeout(() => {
        onZoomComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [zoomed, onZoomComplete]);

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      setShowImages(aspectRatio > 0.5 && aspectRatio < 2.5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ImageContainer zoom={zoomed} hovered={hovered} style={{ transformOrigin }}>
      <img src={background} alt="Background" />
      <AnimatedTitle />
      {foregroundTreesClicks < 20 && (
        <>
          <img
            id="foregroundtrees"
            src={foregroundtrees}
            alt="Foreground Trees"
            onClick={handleForegroundTreesClick}
          />
          <div id="foregroundtreesdiv1" onClick={handleForegroundTreesClick} />
          <div id="foregroundtreesdiv2" onClick={handleForegroundTreesClick} />
        </>
      )}
      <img id="panda" src={asiansign} alt="Asian Sign" />
      <img id="playsign" src={playsign} alt="Play Sign" />
      <div
        id="playbuttondiv"
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
      {showImages &&
        (foregroundTreesClicks >= 20 ? (
          <img id="jiyoung" src={jiyoung} alt="Jiyoung" />
        ) : (
          <img id="aaron" src={aaron} alt="Aaron" />
        ))}
      <img src={backtree} alt="Back Tree" />
      <img id="panda" src={panda} alt="Panda" />
      {showImages && <img id="embarassed" src={embarassed} alt="Embarassed" />}
    </ImageContainer>
  );
};

export default ParallaxLanding;
