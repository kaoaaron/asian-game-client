import React, { useState, useEffect } from "react";
import { 
  Stack, 
  Button, 
  Typography, 
  Box, 
  Paper,
  Fade,
  Slide,
  Grow,
  Zoom,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DiscoverPeopleModal from "../DiscoverPeopleModal.jsx/DiscoverPeopleModal";
import { fetchLeaderboardAvailability, saveLeaderboardData } from "../../api";
import { useNavigate } from "react-router";
import useQuizStore from "../../store";
import trophy from "../../assets/images/landing/trophy.png";
import jyprofile from "../../assets/images/landing/jyprofile.png";
import endgame1 from "../../assets/images/landing/endgame1.png";
import endgame2 from "../../assets/images/landing/endgame2.png";
import endgame3 from "../../assets/images/landing/endgame3.png";

// Styled components for enhanced visual appeal
const AnimatedContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
    animation: "float 6s ease-in-out infinite",
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-20px)" },
  },
}));

const ScoreCard = styled(Card)(({ theme, scoreLevel }) => ({
  background: scoreLevel === "perfect" 
    ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
    : scoreLevel === "excellent"
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : scoreLevel === "good"
    ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  transform: "perspective(1000px) rotateX(5deg)",
  transition: "all 0.3s ease",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  "&:hover": {
    transform: "perspective(1000px) rotateX(0deg) scale(1.02)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  background: variant === "primary" 
    ? "linear-gradient(45deg, #ffd700 30%, #ffed4e 90%)"
    : variant === "secondary"
    ? "linear-gradient(45deg, #667eea 30%, #764ba2 90%)"
    : "linear-gradient(45deg, #4ecdc4 30%, #44a08d 90%)",
  borderRadius: "25px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "12px 30px",
  boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  textTransform: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

const TrophyIcon = styled("img")({
  width: "60px",
  height: "60px",
  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
  animation: "bounce 2s ease-in-out infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
    "40%": { transform: "translateY(-10px)" },
    "60%": { transform: "translateY(-5px)" },
  },
});

const ConfettiPiece = styled(Box)(({ delay, color, left, size }) => ({
  position: "absolute",
  width: size || "8px",
  height: size || "8px",
  background: color,
  borderRadius: "50%",
  left: left || "50%",
  animation: `confetti 4s ease-in-out ${delay}s infinite`,
  "@keyframes confetti": {
    "0%": { 
      transform: "translateY(-100vh) rotate(0deg)", 
      opacity: 1 
    },
    "100%": { 
      transform: "translateY(100vh) rotate(720deg)", 
      opacity: 0 
    },
  },
}));

const StarConfetti = styled(Box)(({ delay, left, size }) => ({
  position: "absolute",
  width: 0,
  height: 0,
  borderLeft: `${size || 8}px solid transparent`,
  borderRight: `${size || 8}px solid transparent`,
  borderBottom: `${size || 16}px solid #ffd700`,
  left: left || "50%",
  animation: `starConfetti 3s ease-in-out ${delay}s infinite`,
  "@keyframes starConfetti": {
    "0%": { 
      transform: "translateY(-100vh) rotate(0deg)", 
      opacity: 1 
    },
    "100%": { 
      transform: "translateY(100vh) rotate(360deg)", 
      opacity: 0 
    },
  },
}));

const LeaderboardForm = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "16px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  marginTop: "8px",
}));

const CaptionImage = styled("img")({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid rgba(255, 255, 255, 0.3)",
  marginRight: "12px",
});

const QuizComplete = ({ score, totalQuestions, scorePercentage, onBack }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [leaderboardQualified, setLeaderboardQualified] = useState(false);
  const [showLeaderboardForm, setShowLeaderboardForm] = useState(false);
  const [submittedToLeaderboard, setSubmittedToLeaderboard] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleViewLeaderboard = () => {
    // Store the quiz results and set the previous screen
    useQuizStore.getState().setQuizResults({ score, totalQuestions, scorePercentage });
    useQuizStore.getState().setPreviousScreen("quiz-complete");
    navigate("/leaderboard");
  };
  
  const filters = useQuizStore((state) => state.filters);

  // Store quiz results when component mounts
  useEffect(() => {
    useQuizStore.getState().setQuizResults({ score, totalQuestions, scorePercentage });
  }, [score, totalQuestions, scorePercentage]);

  // Check leaderboard qualification
  useEffect(() => {
    async function checkLeaderboardQualification() {
      const type = filters.mode === "New" ? "new" : "classic";
      
      const res = await fetchLeaderboardAvailability({
        scored: score,
        total: totalQuestions,
        type: type,
      });
      if (res) {
        setLeaderboardQualified(true);
        setShowLeaderboardForm(true);
      }
    }
    
    checkLeaderboardQualification();
  }, [score, totalQuestions, filters.mode]);

  // Animate content entrance
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLeaderboardSubmit = async () => {
    if (!name.trim()) {
      setSubmitError("Please enter your name");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const type = filters.mode === "New" ? "new" : "classic";
    const res = await saveLeaderboardData({
      name: name.trim(),
      scored: score,
      total: totalQuestions,
      type: type,
    });

    if (res.result) {
      setSubmittedToLeaderboard(true);
      setShowLeaderboardForm(false);
    } else {
      setSubmitError(res.msg || "Failed to submit to leaderboard");
    }

    setSubmitting(false);
  };

  // Function to get the appropriate image based on score percentage
  const getScoreImage = () => {
    if (scorePercentage >= 90) {
      return endgame3; // Best image for 90%+
    } else if (scorePercentage >= 75) {
      return jyprofile; // Good image for 75-89%
    } else if (scorePercentage >= 50) {
      return endgame2; // Medium image for 50-74%
    } else {
      return endgame1; // Worst image for <50%
    }
  };

  // Score-based configurations with funny Asian-themed captions
  const getScoreLevel = () => {
    if (scorePercentage >= 90) return "perfect";
    if (scorePercentage >= 75) return "excellent";
    if (scorePercentage >= 60) return "good";
    return "learning";
  };

  const getScoreTitle = () => {
    const level = getScoreLevel();
    const isNewMode = filters.mode === "New";
    const questionCount = totalQuestions;
    
    switch (level) {
      case "perfect":
        if (isNewMode) {
          return questionCount <= 10 ? "🎯 Dim Sum Master! 🥟" : 
                 questionCount <= 30 ? "🎯 Hot Pot Hero! 🍲" :
                 questionCount <= 50 ? "🎯 Dumpling Dynasty! 🥟" :
                 questionCount <= 100 ? "🎯 Asian Ancestry Expert! 🧬" :
                 questionCount <= 150 ? "🎯 Confucius Level! 📚" :
                 "🎯 Asian DNA Detective! 🔍";
        } else {
          return questionCount <= 10 ? "🎯 Fortune Cookie Perfect! 🥠" :
                 questionCount <= 30 ? "🎯 Tea Ceremony Master! 🍵" :
                 questionCount <= 50 ? "🎯 Asian Culture Guru! 🏮" :
                 questionCount <= 100 ? "🎯 Asian Heritage Hero! 🏛️" :
                 questionCount <= 150 ? "🎯 Asian Wisdom Keeper! 🧘" :
                 "🎯 Asian Legend! 👑";
        }
      case "excellent":
        if (isNewMode) {
          return questionCount <= 10 ? "🌟 Almost a Dim Sum Pro! 🥟" :
                 questionCount <= 30 ? "🌟 Hot Pot Enthusiast! 🍲" :
                 questionCount <= 50 ? "🌟 Dumpling Apprentice! 🥟" :
                 questionCount <= 100 ? "🌟 Asian Genealogy Buff! 🧬" :
                 questionCount <= 150 ? "🌟 Asian Scholar! 📚" :
                 "🌟 Asian Bloodhound! 🐕";
        } else {
          return questionCount <= 10 ? "🌟 Fortune Cookie Fan! 🥠" :
                 questionCount <= 30 ? "🌟 Tea Time Expert! 🍵" :
                 questionCount <= 50 ? "🌟 Asian Culture Buff! 🏮" :
                 questionCount <= 100 ? "🌟 Asian Heritage Explorer! 🏛️" :
                 questionCount <= 150 ? "🌟 Asian Wisdom Seeker! 🧘" :
                 "🌟 Asian Noble! 👑";
        }
      case "good":
        if (isNewMode) {
          return questionCount <= 10 ? "👍 Dim Sum Beginner! 🥟" :
                 questionCount <= 30 ? "👍 Hot Pot Newbie! 🍲" :
                 questionCount <= 50 ? "👍 Dumpling Student! 🥟" :
                 questionCount <= 100 ? "👍 Asian Genealogy Student! 🧬" :
                 questionCount <= 150 ? "👍 Asian Knowledge Seeker! 📚" :
                 "👍 Asian Bloodhound Trainee! 🐕";
        } else {
          return questionCount <= 10 ? "👍 Fortune Cookie Learner! 🥠" :
                 questionCount <= 30 ? "👍 Tea Time Student! 🍵" :
                 questionCount <= 50 ? "👍 Asian Culture Student! 🏮" :
                 questionCount <= 100 ? "👍 Asian Heritage Student! 🏛️" :
                 questionCount <= 150 ? "👍 Asian Wisdom Student! 🧘" :
                 "👍 Asian Apprentice! 👑";
        }
      default:
        if (isNewMode) {
          return questionCount <= 10 ? "📚 Dim Sum Rookie! 🥟" :
                 questionCount <= 30 ? "📚 Hot Pot Rookie! 🍲" :
                 questionCount <= 50 ? "📚 Dumpling Rookie! 🥟" :
                 questionCount <= 100 ? "📚 Asian Genealogy Rookie! 🧬" :
                 questionCount <= 150 ? "📚 Asian Knowledge Rookie! 📚" :
                 "📚 Asian Bloodhound Rookie! 🐕";
        } else {
          return questionCount <= 10 ? "📚 Fortune Cookie Rookie! 🥠" :
                 questionCount <= 30 ? "📚 Tea Time Rookie! 🍵" :
                 questionCount <= 50 ? "📚 Asian Culture Rookie! 🏮" :
                 questionCount <= 100 ? "📚 Asian Heritage Rookie! 🏛️" :
                 questionCount <= 150 ? "📚 Asian Wisdom Rookie! 🧘" :
                 "📚 Asian Rookie! 👑";
        }
    }
  };

  const getScoreMessage = () => {
    const level = getScoreLevel();
    const isNewMode = filters.mode === "New";
    const questionCount = totalQuestions;
    
    switch (level) {
      case "perfect":
        if (isNewMode) {
          return questionCount <= 10 ? "You can spot a dim sum from a mile away! Your chopstick skills are legendary!" :
                 questionCount <= 30 ? "Hot pot master! You know your way around a boiling pot of culture!" :
                 questionCount <= 50 ? "Dumpling dynasty! Your Asian ancestry radar is off the charts!" :
                 questionCount <= 100 ? "Genealogy genius! You're basically an Asian ancestry detective!" :
                 questionCount <= 150 ? "Confucius level wisdom! You've mastered the art of Asian recognition!" :
                 "Asian DNA detective! You can trace bloodlines through photos alone!";
        } else {
          return questionCount <= 10 ? "Fortune cookie perfect! You read the fortunes before they're written!" :
                 questionCount <= 30 ? "Tea ceremony master! You know every Asian culture nuance!" :
                 questionCount <= 50 ? "Asian culture guru! You're basically a walking Asian encyclopedia!" :
                 questionCount <= 100 ? "Heritage hero! You've got Asian heritage knowledge that would make ancestors proud!" :
                 questionCount <= 150 ? "Wisdom keeper! You've achieved Asian cultural enlightenment!" :
                 "Asian legend! You're the stuff of Asian cultural legends!";
        }
      case "excellent":
        if (isNewMode) {
          return questionCount <= 10 ? "Almost a dim sum pro! Just a few more dumplings and you'll be unstoppable!" :
                 questionCount <= 30 ? "Hot pot enthusiast! You're getting the hang of this Asian ancestry thing!" :
                 questionCount <= 50 ? "Dumpling apprentice! Your Asian gene detection skills are growing!" :
                 questionCount <= 100 ? "Genealogy buff! You're becoming quite the Asian ancestry expert!" :
                 questionCount <= 150 ? "Asian scholar! Your knowledge of Asian heritage is impressive!" :
                 "Asian bloodhound! You're sniffing out Asian ancestry like a pro!";
        } else {
          return questionCount <= 10 ? "Fortune cookie fan! You're getting the hang of Asian culture!" :
                 questionCount <= 30 ? "Tea time expert! Your Asian cultural knowledge is brewing nicely!" :
                 questionCount <= 50 ? "Asian culture buff! You're becoming quite the cultural connoisseur!" :
                 questionCount <= 100 ? "Heritage explorer! You're discovering Asian heritage like a true adventurer!" :
                 questionCount <= 150 ? "Wisdom seeker! You're on the path to Asian cultural enlightenment!" :
                 "Asian noble! You're climbing the ranks of Asian cultural nobility!";
        }
      case "good":
        if (isNewMode) {
          return questionCount <= 10 ? "Dim sum beginner! You're learning to spot the good dumplings!" :
                 questionCount <= 30 ? "Hot pot newbie! You're warming up to Asian ancestry detection!" :
                 questionCount <= 50 ? "Dumpling student! Your Asian gene radar is developing!" :
                 questionCount <= 100 ? "Genealogy student! You're studying the art of Asian ancestry!" :
                 questionCount <= 150 ? "Knowledge seeker! You're building your Asian heritage database!" :
                 "Bloodhound trainee! You're learning to sniff out Asian ancestry!";
        } else {
          return questionCount <= 10 ? "Fortune cookie learner! You're starting to understand Asian culture!" :
                 questionCount <= 30 ? "Tea time student! You're steeping yourself in Asian culture!" :
                 questionCount <= 50 ? "Asian culture student! You're taking notes on Asian heritage!" :
                 questionCount <= 100 ? "Heritage student! You're learning about Asian cultural roots!" :
                 questionCount <= 150 ? "Wisdom student! You're studying the ways of Asian culture!" :
                 "Asian apprentice! You're learning the ropes of Asian cultural nobility!";
        }
      default:
        if (isNewMode) {
          return questionCount <= 10 ? "Dim sum rookie! Time to practice your dumpling identification skills!" :
                 questionCount <= 30 ? "Hot pot rookie! You're just starting to boil with Asian ancestry knowledge!" :
                 questionCount <= 50 ? "Dumpling rookie! Your Asian gene detection is still in training!" :
                 questionCount <= 100 ? "Genealogy rookie! You're just beginning your Asian ancestry journey!" :
                 questionCount <= 150 ? "Knowledge rookie! Your Asian heritage database is still growing!" :
                 "Bloodhound rookie! You're still learning to sniff out Asian ancestry!";
        } else {
          return questionCount <= 10 ? "Fortune cookie rookie! Time to crack open some Asian culture books!" :
                 questionCount <= 30 ? "Tea time rookie! You're just starting to steep in Asian culture!" :
                 questionCount <= 50 ? "Asian culture rookie! Your cultural knowledge is still brewing!" :
                 questionCount <= 100 ? "Heritage rookie! You're just beginning your Asian heritage exploration!" :
                 questionCount <= 150 ? "Wisdom rookie! You're still learning the ways of Asian culture!" :
                 "Asian rookie! You're just starting your journey to Asian cultural nobility!";
        }
    }
  };

  const getScoreColor = () => {
    const level = getScoreLevel();
    switch (level) {
      case "perfect":
        return "#ffd700";
      case "excellent":
        return "#ff6b6b";
      case "good":
        return "#4ecdc4";
      default:
        return "#a8edea";
    }
  };

  // Generate confetti for perfect scores
  const renderConfetti = () => {
    if (getScoreLevel() !== "perfect") return null;
    
    const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#a8edea", "#fed6e3"];
    const confettiPieces = [];
    
    // Regular confetti
    for (let i = 0; i < 15; i++) {
      confettiPieces.push(
        <ConfettiPiece
          key={`confetti-${i}`}
          delay={Math.random() * 2}
          color={colors[Math.floor(Math.random() * colors.length)]}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 6 + 4}px`}
        />
      );
    }
    
    // Star confetti
    for (let i = 0; i < 10; i++) {
      confettiPieces.push(
        <StarConfetti
          key={`star-${i}`}
          delay={Math.random() * 2}
          left={`${Math.random() * 100}%`}
          size={Math.random() * 8 + 6}
        />
      );
    }
    
    return confettiPieces;
  };

  return (
    <>
      <AnimatedContainer>
        {renderConfetti()}
        
        <Container maxWidth="md" sx={{ py: 2 }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <Fade in={showContent} timeout={1000}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                      mb: 1,
                      fontSize: { xs: "1.5rem", md: "2.5rem" },
                    }}
                  >
                    {getScoreTitle()}
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={8}>
              <Slide direction="up" in={showContent} timeout={1500}>
                <ScoreCard scoreLevel={getScoreLevel()}>
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Grow in={showContent} timeout={2000}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <CaptionImage src={getScoreImage()} alt="Asian Person" />
                          <Box>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: "bold",
                                color: "white",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                              }}
                            >
                              {score}/{totalQuestions}
                            </Typography>
                            
                            <Typography
                              variant="h5"
                              sx={{
                                color: "white",
                                fontWeight: "bold",
                                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                              }}
                            >
                              {scorePercentage}%
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{
                            color: "white",
                            mb: 2,
                            fontStyle: "italic",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
                          }}
                        >
                          {getScoreMessage()}
                        </Typography>
                      </Box>
                    </Grow>
                  </CardContent>
                </ScoreCard>
              </Slide>
            </Grid>

            {/* Compact Leaderboard Submission Form */}
            {showLeaderboardForm && !submittedToLeaderboard && (
              <Grid item xs={12} md={8}>
                <Zoom in={showContent} timeout={3000}>
                  <LeaderboardForm>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: { xs: "1rem", md: "1.2rem" },
                        }}
                      >
                        🏆 Add to Leaderboard
                      </Typography>
                      <TextField
                        label="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!submitError}
                        helperText={submitError}
                        size="small"
                        sx={{
                          width: "200px",
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "white",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.8rem",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "white",
                          },
                          "& .MuiFormHelperText-root": {
                            color: "#ff6b6b",
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <ActionButton
                        variant="primary"
                        onClick={handleLeaderboardSubmit}
                        disabled={submitting}
                        sx={{ 
                          minWidth: "120px",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                          py: 1,
                        }}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </ActionButton>
                    </Box>
                  </LeaderboardForm>
                </Zoom>
              </Grid>
            )}

            {/* Success Message */}
            {submittedToLeaderboard && (
              <Grid item xs={12} md={8}>
                <Zoom in={submittedToLeaderboard} timeout={500}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      backgroundColor: "rgba(76, 175, 80, 0.9)",
                      color: "white",
                      "& .MuiAlert-icon": {
                        color: "white",
                      },
                    }}
                  >
                    🎉 Successfully added to leaderboard!
                  </Alert>
                </Zoom>
              </Grid>
            )}

            <Grid item xs={12}>
              <Zoom in={showContent} timeout={2500}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <ActionButton
                    variant="primary"
                    onClick={handleOpenModal}
                    sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, py: 1 }}
                  >
                    Discover People
                  </ActionButton>
                  
                  <ActionButton
                    variant="secondary"
                    onClick={() => {
                      useQuizStore.getState().setQuizResults(null); // Clear stored results
                      onBack();
                    }}
                    sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, py: 1 }}
                  >
                    Play Again
                  </ActionButton>
                  
                  <ActionButton
                    variant="tertiary"
                    onClick={handleViewLeaderboard}
                    sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, py: 1 }}
                  >
                    View Leaderboard
                  </ActionButton>
                </Stack>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </AnimatedContainer>

      <DiscoverPeopleModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default QuizComplete;
