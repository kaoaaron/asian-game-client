import React from "react";
import styled from "styled-components";
import {
  Grid,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const FilterOptions = ({ filters, onFilterChange, onStartQuiz }) => {
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
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={6}
      style={{ color: "white" }} // Change text color to white for better contrast
    >
      <Grid item>
        <Typography variant="h5">Select Quiz Options</Typography>
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        spacing={2}
        style={{ color: "white" }} // Change text color to white for better contrast
      >
        <Grid item>
          <Typography variant="p">Number of People:</Typography>
          <RadioGroup row>
            {[10, 30, 50, 100, 200].map((item) => (
              <FormControlLabel
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
        </Grid>
        <Grid item>
          <Typography variant="p">Gender:</Typography>
          <RadioGroup row>
            {["both", "male", "female"].map((item) => (
              <FormControlLabel
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
        </Grid>
      </Grid>
      <Grid item>
        <Button variant="contained" color="gold" onClick={onStartQuiz}>
          Start Quiz
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterOptions;
