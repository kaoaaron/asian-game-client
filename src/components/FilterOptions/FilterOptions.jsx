import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";

const FilterOptions = ({ filters, onFilterChange, onStartQuiz }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleStartQuiz = async () => {
    setIsButtonDisabled(true);
    if (!isButtonDisabled) {
      await onStartQuiz();
    }
  };

  const StyledButtonLabel = styled.span`
    display: inline-block;
    padding: 8px 16px;
    border-radius: 5px;
    border: 1px solid gray;
    color: white;
    cursor: pointer;
    transition: all 0.3s;

    ${({ checked }) =>
      checked &&
      `
      border: 1px solid var(--primary-gold);
      background-color: var(--primary-gold);
      color: black;
    `}
  `;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <Typography variant="h5" sx={{ mb: 4 }}>
        Select Quiz Options
      </Typography>

      <Stack spacing={4} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Number of People
          </Typography>
          <RadioGroup row sx={{ justifyContent: "center" }}>
            {[2, 30, 50, 100, 150, 200].map((item) => (
              <FormControlLabel
                key={item}
                sx={{ margin: "2px" }}
                value={item}
                control={
                  <Radio
                    name="numberOfPeople"
                    sx={{ display: "none" }}
                    onChange={onFilterChange}
                  />
                }
                label={
                  <StyledButtonLabel checked={+filters.numberOfPeople === item}>
                    {item}
                  </StyledButtonLabel>
                }
              />
            ))}
          </RadioGroup>
        </Box>

        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Gender
          </Typography>
          <RadioGroup row sx={{ justifyContent: "center" }}>
            {["both", "male", "female"].map((item) => (
              <FormControlLabel
                key={item}
                sx={{ margin: "2px" }}
                value={item}
                control={
                  <Radio
                    name="gender"
                    sx={{ display: "none" }}
                    onChange={onFilterChange}
                  />
                }
                label={
                  <StyledButtonLabel checked={filters.gender === item}>
                    {item}
                  </StyledButtonLabel>
                }
              />
            ))}
          </RadioGroup>
        </Box>
      </Stack>

      <Button
        variant="contained"
        color="gold"
        onClick={handleStartQuiz}
        sx={{ mt: 4 }}
      >
        Start Quiz
      </Button>
    </Box>
  );
};

export default FilterOptions;
