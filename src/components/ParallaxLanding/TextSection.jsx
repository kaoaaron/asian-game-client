import React, { useEffect, useState } from "react";
import styled from "styled-components";
import developerImage from "../../assets/images/landing/aaronprofile.png";
import developerImage2 from "../../assets/images/landing/jyprofile.png";
import uiImage from "../../assets/images/landing/tempquestionmark.png";
import { fetchGamesPlayedCount, fetchVisitorCount } from "../../api";

const TextSectionContainer = styled.div`
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
  margin-bottom: 1rem;
  text-align: center;

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
`;

const VisitorCountSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin: 2rem 0;
`;

const VisitorCount = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #ffb300;
  padding: 1rem;
  border: 2px solid #ffb300;
  border-radius: 10px;
  background-color: rgba(255, 179, 0, 0.1);
`;

const VisitorCountLabel = styled.h3`
  font-size: 1.5rem; // Adjust label size
  color: #fff; // Color of the label
  margin: 0.5rem 0; // Margin for spacing
  text-align: center; // Center the label
`;

const DonationSection = styled.div`
  margin-top: 3rem;
  text-align: center;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
`;

const DonationForm = styled.form`
  margin-top: 1rem;
`;

const DonateButton = styled.input`
  width: 200px;
  height: auto;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid #ffb300;
    outline-offset: 4px;
  }
`;

const ContributorSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ContributorImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const ContributorName = styled.h2`
  font-size: 2rem;
  margin: 0.5rem 0;
`;

const ContributorDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0;
`;

const ContributorsRow = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const ContributorsHeader = styled.h2`
  font-size: 2.5rem;
  margin: 2rem 0 1rem;
  text-align: center;
`;

const ContributorProfile = ({ image, name, description }) => (
  <ContributorSection>
    <ContributorImage src={image} alt={name} />
    <ContributorName>{name}</ContributorName>
    <ContributorDescription>{description}</ContributorDescription>
  </ContributorSection>
);

const Contributors = () => (
  <>
    <ContributorsHeader>Contributors</ContributorsHeader>
    <ContributorsRow>
      <ContributorProfile
        image={developerImage}
        name="Aaron Kao"
        description="Driving Developer"
      />
      <ContributorProfile
        image={developerImage2}
        name="Jiyoung Lim"
        description="Developer"
      />
      <ContributorProfile
        image={uiImage}
        name="Seohui Nam"
        description="Designer"
      />
    </ContributorsRow>
  </>
);

const TextSection = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [gamesPlayedCount, setGamesPlayedCount] = useState(0);

  useEffect(() => {
    const getVisitorCount = async () => {
      const count = await fetchVisitorCount();
      setVisitorCount(count);
    };

    const getGamesPlayedCount = async () => {
      const count = await fetchGamesPlayedCount();
      setGamesPlayedCount(count);
    };

    getVisitorCount();
    getGamesPlayedCount();
  }, []);

  return (
    <TextSectionContainer>
      <AboutSection>
        {" "}
        <h2>About</h2>
        <p>
          Welcome to <strong>Guess the Asian Ethnicity</strong>, a game designed
          to help people recognize and appreciate the diverse characteristics
          that define Asian cultures.
        </p>
        <p>
          Asia is home to a diversity of ethnicities, each with unique
          histories, languages, and traditions. We aim to break stereotypes and
          foster a deeper understanding of the subtle differences that make each
          ethnicity distinct.
        </p>
        <p>
          We hope this experience will expand your knowledge and appreciation
          for the many cultures across Asia. Get ready to challenge yourself,
          and let’s celebrate diversity together!
        </p>
      </AboutSection>

      <VisitorCountSection>
        <div>
          <VisitorCountLabel>Unique Visitors</VisitorCountLabel>
          <VisitorCount>{visitorCount}</VisitorCount>
        </div>
        <div>
          <VisitorCountLabel>Games Played</VisitorCountLabel>
          <VisitorCount>{gamesPlayedCount}</VisitorCount>
        </div>
      </VisitorCountSection>

      <Contributors />

      <DonationSection>
        <h2>Support Our Project</h2>
        <p>
          Your support helps us enhance this project and maintain an ad-free
          experience. We cover server costs ourselves, so please consider making
          a donation to keep us going!
        </p>

        <DonationForm
          action="https://www.paypal.com/donate"
          method="post"
          target="_top"
        >
          <input type="hidden" name="business" value="33BP42T8YNCVU" />
          <input type="hidden" name="no_recurring" value="1" />
          <input type="hidden" name="currency_code" value="USD" />
          <DonateButton
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_CA/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </DonationForm>
      </DonationSection>
    </TextSectionContainer>
  );
};

export default TextSection;
