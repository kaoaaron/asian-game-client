import React, { useState } from "react";
import styled from "styled-components";
import contributorsData from "./ContributorsData";
import ContributorsProfileModal from "../ContributorsProfileModal/ContributorsProfileModal";
import jynose from "../../assets/images/landing/jynose.png";

const ContributorSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ContributorImage = styled.img`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  margin-bottom: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 980px) {
    width: 350px;
    height: 350px;
  }
`;

const ContributorName = styled.h2`
  font-size: 2rem;
  margin: 0.5rem 0;

  @media (max-width: 980px) {
    font-size: 1.5rem;
  }
`;

const ContributorDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0;

  @media (max-width: 980px) {
    font-size: 1rem;
    max-width: 90%;
  }
`;

const ContributorsRow = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;

  @media (max-width: 980px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

const ContributorsHeader = styled.h2`
  font-size: 2.5rem;
  margin: 2rem 0 1rem;
  text-align: center;

  @media (max-width: 980px) {
    font-size: 2rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 8px 16px;
    font-size: 1.2rem;
    cursor: pointer;
    background-color: #ffb300;
    border: none;
    border-radius: 5px;
    color: white;
    transition: background-color 0.5s, opacity 0.5s ease-out;

    &:hover {
      background-color: #e0a100;
    }

    &.faded {
      opacity: 0;
      pointer-events: none;
    }

    &.correct {
      background-color: green;
      transition: background-color 0.5s;
    }

    &.incorrect {
      background-color: red;
      transition: background-color 0.5s;
    }
  }

  @media (max-width: 980px) {
    flex-direction: row;
  }
`;

const ContributorProfile = ({
  image,
  name,
  description,
  ethnicity,
  setSelectedEthnicity,
  onImageClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonStates, setButtonStates] = useState({
    Chinese: "",
    Korean: "",
    Japanese: "",
  });
  const [isFaded, setIsFaded] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  let longPressTimer;

  const handleButtonClick = (selected) => {
    const isCorrect = selected === ethnicity;

    setButtonStates((prevStates) => ({
      ...prevStates,
      [selected]: isCorrect ? "correct" : "incorrect",
      [ethnicity]: "correct",
    }));

    setTimeout(() => {
      setIsFaded(true);
      setSelectedEthnicity(selected);
      setIsVisible(true);
    }, 500);
  };

  const handleMouseDown = () => {
    longPressTimer = setTimeout(() => {
      setIsLongPressed(true);
      setCurrentImage(jynose);
    }, 5000);
  };

  const handleMouseUp = (event) => {
    clearTimeout(longPressTimer);
    if (isLongPressed) {
      event.stopPropagation();
    }
  };

  return (
    <ContributorSection>
      <ContributorImage
        src={currentImage}
        alt={name}
        onClick={(event) => {
          if (!isLongPressed) {
            onImageClick({ name, description, ethnicity });
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      />
      <ButtonRow>
        {!isFaded && (
          <>
            <button
              className={buttonStates["Chinese"]}
              onClick={() => handleButtonClick("Chinese")}
            >
              Chinese
            </button>
            <button
              className={buttonStates["Korean"]}
              onClick={() => handleButtonClick("Korean")}
            >
              Korean
            </button>
            <button
              className={buttonStates["Japanese"]}
              onClick={() => handleButtonClick("Japanese")}
            >
              Japanese
            </button>
          </>
        )}
      </ButtonRow>

      {isVisible && (
        <>
          <ContributorName>{name}</ContributorName>
          <ContributorDescription>{description}</ContributorDescription>
        </>
      )}
    </ContributorSection>
  );
};

const Contributors = () => {
  const [selectedEthnicity, setSelectedEthnicity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState(null);

  const onImageClick = (contributor) => {
    setSelectedContributor(contributor);
    console.log(contributor, "asd2");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <ContributorsHeader>Contributors</ContributorsHeader>
      <ContributorsRow>
        {contributorsData.map((contributor, index) => (
          <ContributorProfile
            key={index}
            image={contributor.image}
            name={contributor.name}
            description={contributor.description}
            ethnicity={contributor.ethnicity}
            setSelectedEthnicity={setSelectedEthnicity}
            onImageClick={() =>
              onImageClick({
                name: contributor.name,
                description: contributor.profileDescription,
                ethnicity: contributor.ethnicity,
                image: contributor.profileImage,
                linkedIn: contributor?.linkedIn,
              })
            }
          />
        ))}
      </ContributorsRow>

      {selectedContributor && (
        <ContributorsProfileModal
          open={modalOpen}
          onClose={handleCloseModal}
          contributor={selectedContributor}
        />
      )}
    </>
  );
};

export default Contributors;
