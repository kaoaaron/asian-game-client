import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";

const App = () => {
  const [person, setPerson] = useState(null);

  const fetchRandomPerson = async () => {
    try {
      const response = await fetch("https://asianapi.onrender.com/random");
      const data = await response.json();
      setPerson(data[0]);
    } catch (error) {}
  };

  useEffect(() => {
    fetchRandomPerson();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Asian Person
      </Typography>
      {person ? (
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={person.imageUrl}
                alt={person.name}
                style={{ objectFit: "contain", height: "auto" }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {person.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {person.description || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Occupation:</strong> {person.occupation || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Ethnicity:</strong> {person.ethnicity || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Native Name:</strong> {person.nativeName || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Birth Date:</strong> {person.birthDate || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Birth Place:</strong> {person.birthPlace || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Death Date:</strong> {person.deathDate || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Notable Work:</strong> {person.notableWork || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {person.gender || "N/A"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchRandomPerson}
                  style={{ marginTop: "16px" }}
                >
                  Generate New Asian
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      )}
    </Container>
  );
};

export default App;
