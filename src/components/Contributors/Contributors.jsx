import React, { useState } from "react";
import styled from "styled-components";
import developerImage from "../../assets/images/landing/aaronprofile.png";
import developerImage2 from "../../assets/images/landing/jyprofile.png";
import uiImage from "../../assets/images/landing/seohui.png";

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
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonStates, setButtonStates] = useState({
    Chinese: "",
    Korean: "",
    Japanese: "",
  });
  const [isFaded, setIsFaded] = useState(false);

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

  return (
    <ContributorSection>
      <ContributorImage src={image} alt={name} />
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

  return (
    <>
      <ContributorsHeader>Contributors</ContributorsHeader>
      <ContributorsRow>
        <ContributorProfile
          image={developerImage}
          name="Aaron Kao"
          description="Driving Developer"
          ethnicity="Chinese"
          selectedEthnicity={selectedEthnicity}
          setSelectedEthnicity={setSelectedEthnicity}
        />
        <ContributorProfile
          image={developerImage2}
          name="Jiyoung Lim"
          description="Developer"
          ethnicity="Korean"
          selectedEthnicity={selectedEthnicity}
          setSelectedEthnicity={setSelectedEthnicity}
        />
        <ContributorProfile
          image={uiImage}
          name="Seohui Nam"
          description="Designer"
          ethnicity="Korean"
          selectedEthnicity={selectedEthnicity}
          setSelectedEthnicity={setSelectedEthnicity}
        />
      </ContributorsRow>
    </>
  );
};

export default Contributors;
