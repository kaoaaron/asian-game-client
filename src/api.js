// api.js
export const fetchVisitorCount = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}/visitor-count`
    );
    const data = await response.json();
    return data.uniqueVisitorCount;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return 0;
  }
};

export const fetchGamesPlayedCount = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}/game-count`
    );
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error("Error fetching games played count:", error);
    return 0;
  }
};

export const fetchPeopleData = async (filters) => {
  const { numberOfPeople, gender } = filters;
  const genderFilter = gender === "both" ? "" : `&gender=${gender}`;
  const query = `/people?limit=${numberOfPeople}${genderFilter}`;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching people data:", error);
    return [];
  }
};
