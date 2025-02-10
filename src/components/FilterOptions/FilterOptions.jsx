import React, { useState, useRef } from "react";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import WcIcon from "@mui/icons-material/Wc";
import styled from "styled-components";
import { fetchPeopleData } from "../../api";
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

const OptionContainer = styled(Box)`
  display: flex;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    numberOfPeople: 10,
    gender: "both",
    minAge: "0",
    maxAge: "200",
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

  const numberOptions = [10, 30, 50, 100, 150, 200];
  const genderOptions = ["both", "male", "female"];
  const numberRef = useRef(null);
  const genderRef = useRef(null);

  const setFilters = useQuizStore((state) => state.setFilters);
  const setScreen = useQuizStore((state) => state.setScreen);
  const setPeople = useQuizStore((state) => state.setPeople);
  const setZoomFinished = useQuizStore((state) => state.setZoomFinished);
  const setLeaderboardQualified = useQuizStore(
    (state) => state.setLeaderboardQualified
  );

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
    setLocalFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStartQuiz = async () => {
    const minAge = parseInt(localFilters.minAge) || 0;
    const maxAge = parseInt(localFilters.maxAge) || 200;

    if (minAge >= maxAge) {
      setAgeError("Invalid Age Range");
      return;
    }

    setIsButtonDisabled(true);
    if (!isButtonDisabled) {
      setFilters({
        ...localFilters,
        minAge,
        maxAge,
      });
      let occupationsList = [];
      for (let category of categoryName) {
        occupationsList.push(...getOccupations(category));
      }

      occupationsList = [...new Set(occupationsList)];

      if (
        occupationsList.length > 0 ||
        minAge !== 0 ||
        maxAge !== 200 ||
        localFilters.gender !== "both"
      ) {
        setLeaderboardQualified(false);
      }

      const data = await fetchPeopleData({
        ...localFilters,
        minAge,
        maxAge,
        occupationsList,
      });
      setPeople(data);
      setScreen(ScreenEnum.QUIZ);
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
        paddingTop: "30px",
        border: "thick double gold",
      }}
    >
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1,
          backgroundColor: "#ffd700",
          color: "#000",
          "&:hover": {
            backgroundColor: "#e6b800",
          },
        }}
        onClick={handleBack}
      >
        Back
      </Button>

      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", letterSpacing: "1px" }}
      >
        Select Quiz Options
      </Typography>

      <Stack spacing={4} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center" }} tabIndex={0} ref={numberRef}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
            Number of People
          </Typography>
          <OptionContainer>
            <RadioGroup row sx={{ flexWrap: "nowrap" }}>
              {numberOptions.map((item) => (
                <FormControlLabel
                  key={item}
                  value={item}
                  sx={{ margin: 0 }}
                  control={
                    <Radio
                      name="numberOfPeople"
                      sx={{ display: "none" }}
                      onChange={handleFilterChange}
                    />
                  }
                  label={
                    <StyledButtonLabel
                      checked={+localFilters.numberOfPeople === item}
                    >
                      {item}
                    </StyledButtonLabel>
                  }
                />
              ))}
            </RadioGroup>
          </OptionContainer>
        </Box>

        <Typography>
          Using the options below will disqualify you from the leaderboard.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
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
              <RadioGroup row sx={{ flexWrap: "nowrap" }}>
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
              Age Range
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <Box
                sx={{
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {ageError && (
                  <Typography color="error" variant="caption">
                    {ageError}
                  </Typography>
                )}
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
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
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

      <Button
        variant="contained"
        sx={{
          mt: 4,
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#ffd700",
          color: "#000",
          "&:hover": {
            backgroundColor: "#e6b800",
          },
        }}
        onClick={handleStartQuiz}
        disabled={isButtonDisabled}
      >
        Start Quiz
      </Button>
    </Box>
  );
};

export default FilterOptions;
