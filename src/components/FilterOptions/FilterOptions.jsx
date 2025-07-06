import React, { useState, useRef } from "react";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import WcIcon from "@mui/icons-material/Wc";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import jyback from "../../assets/images/landing/jyback.png";
import { fetchPeopleData, fetchPeopleGroupedData } from "../../api";
import {
  getSortedCategories,
  getOccupations,
} from "../../utils/occupationCategories";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  TextField,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import useQuizStore, { ScreenEnum } from "../../store";

const categories = getSortedCategories();

const StyledButtonLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  text-transform: capitalize;
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.2);

  ${({ checked }) =>
    checked &&
    `
    background-color: #ffd700;
    color: #000;
    font-weight: bold;
  `}

  &:hover {
    background-color: rgba(255, 215, 0, 0.2);
  }

  &:last-child {
    border-right: none;
  }
`;

const NumberButtonLabel = styled(StyledButtonLabel)`
  padding: ${(props) => (props.isMobile ? "8px 10px" : "12px 20px")};
  font-size: ${(props) => (props.isMobile ? "14px" : "16px")};
`;

const OptionContainer = styled(Box)`
  display: flex;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
  max-width: 100%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;

const StyledTextField = styled(TextField)`
  width: 80px;

  & .MuiOutlinedInput-root {
    color: white;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: #ffd700;
    }
  }

  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }

  & input {
    text-align: center;
  }
`;

const FilterOptions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    numberOfPeople: "10",
    gender: "both",
    minAge: "0",
    maxAge: "200",
    mode: "Classic",
  });
  const [ageError, setAgeError] = useState("");
  const [categoryName, setCategoryName] = React.useState([]);

  const handleMultiSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value.length > 1) {
      setCategoryName(value.filter((item) => item !== "All Categories"));
    } else if (value.length === 0) {
      setCategoryName(["All Categories"]);
    } else {
      setCategoryName(value);
    }
  };

  const getNumberOptions = () => {
    return localFilters.mode === "New" ? [10, 30] : [10, 30, 50, 100, 150, 200];
  };

  const genderOptions = ["both", "male", "female"];
  const modeOptions = ["Classic", "New"];
  const numberRef = useRef(null);
  const genderRef = useRef(null);

  const setFilters = useQuizStore((state) => state.setFilters);
  const setScreen = useQuizStore((state) => state.setScreen);
  const setPeople = useQuizStore((state) => state.setPeople);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const setLeaderboardQualified = useQuizStore(
    (state) => state.setLeaderboardQualified
  );
  const timerDisabled = useQuizStore((state) => state.timerDisabled);
  const setTimerDisabled = useQuizStore((state) => state.setTimerDisabled);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleMouseDown = () => {
    setTimer(
      setTimeout(() => {
        setIsBackgroundVisible(true);
      }, 5000)
    );
  };

  const handleMouseUp = () => {
    clearTimeout(timer);
  };

  const validateAge = (value) => {
    if (value === "") return value;
    const num = parseInt(value);
    if (isNaN(num)) return "0";
    if (num < 0) return "0";
    if (num > 200) return "200";
    return String(num);
  };

  const validateAgeRange = (min, max) => {
    if (min === "" || max === "") return "";
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    if (isNaN(minNum) || isNaN(maxNum)) return "";
    if (minNum >= maxNum) {
      return "Invalid Age Range";
    }
    return "";
  };

  const handleAgeChange = (e) => {
    const { name, value } = e.target;
    const validatedAge = validateAge(value);

    setLocalFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: validatedAge,
      };

      const error = validateAgeRange(
        name === "minAge" ? validatedAge : prev.minAge,
        name === "maxAge" ? validatedAge : prev.maxAge
      );
      setAgeError(error);

      return newFilters;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "mode") {
      setLocalFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        // Reset numberOfPeople to 10 if current value isn't valid for New mode
        if (
          value === "New" &&
          ![10, 30].includes(Number(prev.numberOfPeople))
        ) {
          newFilters.numberOfPeople = "10";
        }
        return newFilters;
      });
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStartQuiz = async () => {
    const minAge = parseInt(localFilters.minAge) || 0;
    const maxAge = parseInt(localFilters.maxAge) || 200;

    if (minAge >= maxAge) {
      setAgeError("Invalid Age Range");
      return;
    }

    setIsLoading(true);

    setFilters({
      ...localFilters,
      minAge,
      maxAge,
    });

    try {
      let occupationsList = [];
      for (let category of categoryName) {
        occupationsList.push(...getOccupations(category));
      }

      occupationsList = [...new Set(occupationsList)];
      if (
        occupationsList.length > 0 ||
        minAge !== 0 ||
        maxAge !== 200 ||
        localFilters.gender !== "both" ||
        timerDisabled
      ) {
        setLeaderboardQualified(false);
      }

      const data =
        localFilters.mode === "New"
          ? await fetchPeopleGroupedData({
              ...localFilters,
              minAge,
              maxAge,
              occupationsList,
            })
          : await fetchPeopleData({
              ...localFilters,
              minAge,
              maxAge,
              occupationsList,
            });

      setPeople(data);
      setScreen(ScreenEnum.QUIZ);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setScreen(ScreenEnum.START);
    setZoomFinished(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        border: "thick double gold",
        position: "relative",
        backgroundImage: isBackgroundVisible ? `url(${jyback})` : "none",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        maxWidth: "100vw",
        overflow: "hidden",
        padding: isMobile ? "10px" : "20px",
        boxSizing: "border-box",
      }}
    >
      {!isMobile && (
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "#ffd700",
            color: "#000",
            "&:hover": {
              backgroundColor: "#e6b800",
            },
            zIndex: 10,
          }}
          onClick={handleBack}
        >
          Back
        </Button>
      )}

      {!isMobile && (
        <Typography
          variant="h4"
          sx={{ 
            mb: 2, 
            fontWeight: "bold", 
            letterSpacing: "1px",
            mt: 2,
          }}
        >
          Select Quiz Options
        </Typography>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Stack
          spacing={isMobile ? 1.5 : 3}
          alignItems="center"
          sx={{ 
            width: "100%", 
            maxWidth: isMobile ? "100%" : 800,
            mx: "auto", 
            px: isMobile ? 1 : 2,
            pb: 2,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              padding: isMobile ? "6px" : "10px",
              maxWidth: "100%",
              width: "100%",
              mb: isMobile ? 1 : 2,
              border: "2px solid #ffd700",
              borderRadius: "12px",
              background: "rgba(255, 215, 0, 0.08)",
              boxShadow: isMobile ? "0 0 0 0" : "0 2px 8px 0 rgba(0,0,0,0.08)",
            }}
            tabIndex={0}
            ref={numberRef}
          >
            <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: "700", color: "#ffd700", fontSize: isMobile ? "20px" : "28px", letterSpacing: 1 }}>
              Number of Questions
            </Typography>
            <OptionContainer sx={{ maxWidth: "100%" }}>
              <RadioGroup
                row
                sx={{ flexWrap: "nowrap" }}
                value={localFilters.numberOfPeople}
              >
                {getNumberOptions().map((item) => (
                  <FormControlLabel
                    key={item}
                    value={String(item)}
                    sx={{ margin: 0 }}
                    control={
                      <Radio
                        name="numberOfPeople"
                        sx={{ display: "none" }}
                        onChange={handleFilterChange}
                      />
                    }
                    label={
                      <NumberButtonLabel
                        checked={localFilters.numberOfPeople === String(item)}
                        isMobile={isMobile}
                      >
                        {item}
                      </NumberButtonLabel>
                    }
                  />
                ))}
              </RadioGroup>
            </OptionContainer>
          </Box>
          <Typography sx={{ textAlign: "center", maxWidth: "100%" }}>
            Using the options below will disqualify you from the leaderboard.
          </Typography>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "500", textAlign: "center" }}
            >
              Mode
            </Typography>
            <OptionContainer>
              <RadioGroup
                row
                sx={{ flexWrap: "nowrap" }}
                value={localFilters.mode}
              >
                {modeOptions.map((item) => (
                  <FormControlLabel
                    key={item}
                    value={item}
                    sx={{ margin: 0 }}
                    control={
                      <Radio
                        name="mode"
                        sx={{ display: "none" }}
                        onChange={handleFilterChange}
                      />
                    }
                    label={
                      <StyledButtonLabel checked={localFilters.mode === item}>
                        {item}
                      </StyledButtonLabel>
                    }
                  />
                ))}
              </RadioGroup>
            </OptionContainer>
          </Box>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
              mb: 1,
              mt: 0.5,
            }}
          >
            <Checkbox
              checked={timerDisabled}
              onChange={(e) => setTimerDisabled(e.target.checked)}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-checked": {
                  color: "#ffd700",
                },
                p: 0.25,
              }}
            />
            <Typography
              sx={{
                color: "white",
                fontSize: isMobile ? "13px" : "15px",
                wordBreak: "break-word",
                lineHeight: 1.2,
              }}
            >
              Disable Timer
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? 1 : 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                border: "solid gold",
                padding: "10px",
                borderRadius: "16px",
              }}
              tabIndex={0}
              ref={genderRef}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
                Gender
              </Typography>
              <OptionContainer>
                <RadioGroup row sx={{ flexWrap: "nowrap", height: "40px" }}>
                  {genderOptions.map((item) => (
                    <FormControlLabel
                      key={item}
                      value={item}
                      sx={{ margin: 0 }}
                      control={
                        <Radio
                          name="gender"
                          sx={{ display: "none" }}
                          onChange={handleFilterChange}
                        />
                      }
                      label={
                        <StyledButtonLabel checked={localFilters.gender === item}>
                          {item === "male" && <ManIcon />}
                          {item === "female" && <WomanIcon />}
                          {item === "both" && <WcIcon />}
                        </StyledButtonLabel>
                      }
                    />
                  ))}
                </RadioGroup>
              </OptionContainer>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                border: "solid gold",
                padding: "10px",
                borderRadius: "16px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                Age Range
              </Typography>
              <Box
                sx={{
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {ageError && (
                  <Typography color="error" variant="caption">
                    {ageError}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <StyledTextField
                    type="number"
                    name="minAge"
                    value={localFilters.minAge}
                    onChange={handleAgeChange}
                    inputProps={{ min: 0, max: 200 }}
                    size="small"
                    error={!!ageError}
                  />
                  <Typography>to</Typography>
                  <StyledTextField
                    type="number"
                    name="maxAge"
                    value={localFilters.maxAge}
                    onChange={handleAgeChange}
                    inputProps={{ min: 0, max: 200 }}
                    size="small"
                    error={!!ageError}
                  />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                border: "solid gold",
                padding: "10px",
                borderRadius: "16px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
                Categories
              </Typography>
              <OptionContainer>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={
                    categoryName.length === 0 ? ["All Categories"] : categoryName
                  }
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => {
                    const displayValue = Array.isArray(selected)
                      ? selected.join(", ")
                      : "";
                    return (
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: "calc(100% - 30px)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayValue}
                      </span>
                    );
                  }}
                  sx={{
                    width: "200px",
                    height: "40px",
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "10px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffd700",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "4px",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        color: "white",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "rgba(255, 215, 0, 0.2)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(255, 215, 0, 0.4)",
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    disabled
                    selected={categoryName.length === 0}
                  >
                    All Categories
                  </MenuItem>
                  {categories.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox
                        checked={categoryName.includes(name)}
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-checked": {
                            color: "#ffd700",
                          },
                        }}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </OptionContainer>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: isMobile ? "8px" : "16px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: isMobile ? "10px" : "15px",
          flexWrap: isMobile ? "wrap" : "nowrap",
          mt: "auto",
        }}
      >
        {isMobile && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffd700",
              color: "#000",
              "&:hover": {
                backgroundColor: "#e6b800",
              },
              minWidth: "80px",
              maxWidth: "120px",
            }}
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          sx={{
            padding: isMobile ? "8px 12px" : "12px 20px",
            fontSize: isMobile ? "12px" : "16px",
            backgroundColor: "#ffd700",
            color: "#000",
            "&:hover": {
              backgroundColor: "#e6b800",
            },
            "&:disabled": {
              backgroundColor: "#ccac00",
              color: "#666",
            },
            minWidth: isMobile ? "100px" : "120px",
            maxWidth: isMobile ? "150px" : "200px",
            boxSizing: "border-box",
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleStartQuiz}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={20}
                sx={{
                  color: "#666",
                  marginRight: "8px",
                }}
              />
              Loading...
            </>
          ) : (
            "Start Quiz"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default FilterOptions;
