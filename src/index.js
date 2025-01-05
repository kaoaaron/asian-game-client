import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { BrowserRouter, Routes, Route } from "react-router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
