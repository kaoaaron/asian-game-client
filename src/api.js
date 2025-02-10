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

export const fetchTopCountryCodes = async (count) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}/topPlayedCountryCodes?count=${count}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
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

export const fetchLeaderboardData = async () => {
  const query = `/leaderboard`;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
};

export const fetchLeaderboardAvailability = async ({ scored, total }) => {
  const query = `/is-leader?scored=${scored}&total=${total}`;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard availability:", error);
    return [];
  }
};

export const saveLeaderboardData = async (data) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_ASIAN_API_URL}/leaderboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error: ", error);
    return { result: false };
  }
};
