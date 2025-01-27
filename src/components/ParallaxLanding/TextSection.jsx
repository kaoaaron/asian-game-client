import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchGamesPlayedCount, fetchVisitorCount } from "../../api";
import Contributors from "../Contributors/Contributors";
import { hasKey, setItem, getItem } from "../../utils/localStorage";

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

  @media (max-width: 980px) {
    padding: 1rem;
  }
`;

const AboutSection = styled.div`
  margin-bottom: 1rem;
  text-align: center;

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;

    @media (max-width: 980px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 2rem;

    @media (max-width: 980px) {
      font-size: 1rem;
      max-width: 90%;
    }
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

  @media (max-width: 980px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const VisitorCount = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #ffb300;
  padding: 1rem;
  border: 2px solid #ffb300;
  border-radius: 10px;
  background-color: rgba(255, 179, 0, 0.1);

  @media (max-width: 980px) {
    font-size: 2.5rem;
  }
`;

const VisitorCountLabel = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin: 0.5rem 0;
  text-align: center;
`;

const DonationSection = styled.div`
  margin-top: 3rem;
  text-align: center;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;

    @media (max-width: 980px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 2rem;

    @media (max-width: 980px) {
      font-size: 1rem;
      max-width: 90%;
    }
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

const VISITORSKEY = "visitedCount";
const PLAYEDGAMESKEY = "playedCount";
const msCacheExpiryTime = 1800000;

const TextSection = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [gamesPlayedCount, setGamesPlayedCount] = useState(0);

  useEffect(() => {
    const getVisitorCount = async () => {
      const count = await fetchVisitorCount();
      console.log(count);
      setVisitorCount(count);
      setItem(VISITORSKEY, {
        ...(getItem(VISITORSKEY) ?? null),
        visitorCount: count,
        expires: Date.now() + msCacheExpiryTime,
      });
    };

    const getGamesPlayedCount = async () => {
      const count = await fetchGamesPlayedCount();
      setGamesPlayedCount(count);
      setItem(PLAYEDGAMESKEY, {
        ...(getItem(PLAYEDGAMESKEY) ?? null),
        playerCount: count,
        expires: Date.now() + msCacheExpiryTime,
      });
    };

    if (hasKey(PLAYEDGAMESKEY)) {
      const { playerCount, expires } = getItem(PLAYEDGAMESKEY);
      if (expires > Date.now()) {
        setGamesPlayedCount(playerCount);
      }
    } else {
      getGamesPlayedCount();
    }

    if (hasKey(VISITORSKEY)) {
      const { visitorCount, expires } = getItem(VISITORSKEY);
      if (expires > Date.now()) {
        setVisitorCount(visitorCount);
      }
    } else {
      getVisitorCount();
    }
  }, []);

  return (
    <TextSectionContainer>
      <AboutSection>
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
