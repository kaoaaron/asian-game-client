import React from "react";
import {
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";

const FilterOptions = ({ filters, onFilterChange, onStartQuiz }) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={2}
      style={{ color: "white" }} // Change text color to white for better contrast
    >
      <Grid item>
        <Typography variant="h5">Select Quiz Options</Typography>
      </Grid>

      <Grid item>
        <TextField
          label="Number of People"
          type="number"
          name="numberOfPeople"
          value={filters.numberOfPeople}
          onChange={onFilterChange}
          inputProps={{ min: 1 }}
          variant="outlined" // Adding variant for better visibility
          InputLabelProps={{
            style: { color: "white" }, // Label color
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white", // Border color for input field
              },
              "&:hover fieldset": {
                borderColor: "white", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "white", // Border color when focused
              },
            },
            "& .MuiInputBase-input": {
              color: "white", // Text color inside input
            },
          }}
        />
      </Grid>

      <Grid item>
        <FormControl variant="outlined">
          <InputLabel style={{ color: "white" }}>Gender</InputLabel>
          <Select
            name="gender"
            value={filters.gender}
            onChange={onFilterChange}
            sx={{
              color: "white", // Text color for the select input
              "& .MuiSelect-icon": {
                color: "white", // Icon color for the dropdown
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Border color for the select field
                },
                "&:hover fieldset": {
                  borderColor: "white", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white", // Border color when focused
                },
              },
            }}
          >
            <MenuItem value="both">Both</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          style={{ backgroundColor: "#1976d2" }} // Customize button color
          onClick={onStartQuiz}
        >
          Start Quiz
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterOptions;
