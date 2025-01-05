import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CustomModal from "../CustomModal/CustomModal";
import useQuizStore from "../../store";
import { useMediaQuery } from "@mui/material";

const DiscoverPeopleModal = ({ open, onClose }) => {
  const people = useQuizStore((state) => state.people);
  const incorrectGuesses = useQuizStore((state) => state.incorrectGuesses);

  const [expandedPerson, setExpandedPerson] = useState(null);
  const [filter, setFilter] = useState("all");

  const isMobile = useMediaQuery("(max-width:980px)");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPeople = people.filter((person) => {
    if (filter === "all") return true;
    if (filter === "correct") return !incorrectGuesses.includes(person._id);
    if (filter === "incorrect") return incorrectGuesses.includes(person._id);
  });

  const handleToggle = (id) => {
    setExpandedPerson(expandedPerson === id ? null : id);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Discover People">
      <Box sx={{ marginBottom: 2 }}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={filter}
            onChange={handleFilterChange}
            aria-label="filter"
            name="filter"
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="correct"
              control={<Radio />}
              label="Correct"
            />
            <FormControlLabel
              value="incorrect"
              control={<Radio />}
              label="Incorrect"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
        }}
      >
        <List>
          {filteredPeople.map((person) => (
            <React.Fragment key={person._id}>
              <ListItem button onClick={() => handleToggle(person._id)}>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {incorrectGuesses.includes(person._id) && (
                        <CancelIcon
                          style={{
                            color: "red",
                            fontSize: "1.2rem",
                            marginRight: "8px",
                          }}
                        />
                      )}
                      {!incorrectGuesses.includes(person._id) &&
                        !person.knownCorrect && (
                          <CheckCircleIcon
                            style={{
                              color: "green",
                              fontSize: "1.2rem",
                              marginRight: "8px",
                            }}
                          />
                        )}
                      {person.name}
                    </Box>
                  }
                />
                {expandedPerson === person._id ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse
                in={expandedPerson === person._id}
                timeout="auto"
                unmountOnExit
              >
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    {person.description}
                  </Typography>
                  <Stack
                    direction={isMobile ? "column" : "row"} // Stack items in column for mobile, row for desktop
                    spacing={2}
                    alignItems={isMobile ? "flex-start" : "center"} // Align items to start for mobile
                    sx={{ mt: 2 }}
                  >
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      style={{
                        width: isMobile ? "150px" : "100px", // Bigger image for mobile
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    <Box>
                      <Typography variant="body2">
                        <strong>Native Name:</strong> {person.nativeName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Birth Date:</strong>{" "}
                        {new Date(person.birthDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Death Date:</strong>{" "}
                        {person.deathDate
                          ? new Date(person.deathDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Occupation:</strong> {person.occupation}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ethnicity:</strong> {person.ethnicity}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Birth Place:</strong> {person.birthPlace}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </CustomModal>
  );
};

export default DiscoverPeopleModal;
