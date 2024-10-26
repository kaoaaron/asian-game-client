import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import background from "../../assets/images/landing/background.png";
import foregroundtrees from "../../assets/images/landing/foregroundtrees.png";
import multiplayersign from "../../assets/images/landing/multiplayersign.png";
import multiplayersignhover from "../../assets/images/landing/multiplayersignhover.png";
import playsign from "../../assets/images/landing/playsign.png";
import playsignhover from "../../assets/images/landing/playsignhover.png";
import rooftop from "../../assets/images/landing/rooftop.png";
import dooropen from "../../assets/images/landing/dooropen.png";
import backtree from "../../assets/images/landing/backtree.png";
import panda from "../../assets/images/landing/panda.png";
import jiyoung from "../../assets/images/landing/jiyoung.png";
import embarassed from "../../assets/images/landing/embarassed.png";
import aaron from "../../assets/images/landing/aaron.png";
import developerImage from "../../assets/images/landing/aaron.png";
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

  #multiplayersign,
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

  #multiplayerbuttondiv {
    position: absolute;
    top: 71%;
    left: 42%;
    width: 11vw;
    height: 8vh;
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

  #panda-div {
    position: absolute;
    bottom: 0%;
    right: 0%;
    width: 26vw;
    height: 30vh;
    z-index: 9;
    cursor: pointer;
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
    transition: top 1.5s ease-in-out;
  }

  #aaron {
    position: absolute;
    right: 16vw;
    top: ${({ hovered }) => (hovered ? "17vh" : "44vh")};
    width: 25vw;
    height: 40vh;
    transform-origin: bottom right;
    transform: rotate(25deg) translateX(-10%) translateY(10%);
    transition: top 1.5s ease-in-out;
  }
`;

const TextSection = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const AboutSection = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const DeveloperSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const DeveloperImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const DeveloperName = styled.h2`
  font-size: 2rem;
  margin: 0.5rem 0;
`;

const DeveloperDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
`;

const ParallaxLanding = ({ onZoomComplete }) => {
  const [hovered, setHovered] = useState(false);
  const [mpHovered, setMpHovered] = useState(false);
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

      // Adjust for both the top and scroll position
      const originX = left + width / 2 + 35;
      const originY = top + height / 2 + window.scrollY;

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
    <>
      <ImageContainer
        zoom={zoomed}
        hovered={hovered}
        style={{ transformOrigin }}
      >
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
            <div
              id="foregroundtreesdiv1"
              onClick={handleForegroundTreesClick}
            />
            <div
              id="foregroundtreesdiv2"
              onClick={handleForegroundTreesClick}
            />
          </>
        )}
        <div
          id="multiplayerbuttondiv"
          onMouseEnter={() => setMpHovered(true)}
          onMouseLeave={() => setMpHovered(false)}
        />
        <img
          id="multiplayersign"
          src={multiplayersign}
          alt="Multiplayer Sign"
        />
        {mpHovered && (
          <img
            id="multiplayersign"
            src={multiplayersignhover}
            alt="Multiplayer Sign Hover"
          />
        )}
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
        <div id="panda-div" />

        {showImages && (
          <img id="embarassed" src={embarassed} alt="Embarassed" />
        )}
      </ImageContainer>

      <TextSection>
        <AboutSection>
          <h2>About</h2>
          <p>
            Lorem Ipsum，也称乱数假文或者哑元文本，
            是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem
            Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem
            Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus
            PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。
          </p>
        </AboutSection>

        <DeveloperSection>
          <DeveloperImage src={developerImage} alt="Developer" />
          <DeveloperName>Aaron Kao</DeveloperName>
          <DeveloperDescription>
            以下展示了自1500世纪以来使用的标准Lorem Ipsum段落，西塞罗笔下“de
            Finibus Bonorum et Malorum”章节1.10.32 ，
            1.10.33的原著作，以及其1914年译自H. Rackham的英文版本。
          </DeveloperDescription>
        </DeveloperSection>
      </TextSection>
    </>
  );
};

export default ParallaxLanding;
