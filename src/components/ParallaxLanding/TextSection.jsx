import React from "react";
import styled from "styled-components";
import developerImage from "../../assets/images/landing/aaron.png";

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

const TextSection = () => (
  <TextSectionContainer>
    <AboutSection>
      <h2>About</h2>
      <p>
        Lorem
        Ipsum，也称乱数假文或者哑元文本，是印刷及排版领域所常用的虚拟文字。
        由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，
        Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。
      </p>
    </AboutSection>

    <DeveloperSection>
      <DeveloperImage src={developerImage} alt="Developer" />
      <DeveloperName>Aaron Kao</DeveloperName>
      <DeveloperDescription>
        以下展示了自1500世纪以来使用的标准Lorem Ipsum段落， 西塞罗笔下“de
        Finibus Bonorum et Malorum”章节1.10.32 ，
        1.10.33的原著作，以及其1914年译自H. Rackham的英文版本。
      </DeveloperDescription>
    </DeveloperSection>
  </TextSectionContainer>
);

export default TextSection;
