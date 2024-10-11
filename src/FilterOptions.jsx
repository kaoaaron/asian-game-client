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
    <Grid container direction="column" alignItems="center" spacing={2}>
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
        />
      </Grid>

      <Grid item>
        <FormControl>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={filters.gender}
            onChange={onFilterChange}
          >
            <MenuItem value="both">Both</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <Button variant="contained" color="primary" onClick={onStartQuiz}>
          Start Quiz
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterOptions;
