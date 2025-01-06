import React from "react";
import { Box, Typography, Link } from "@mui/material";
import CustomModal from "../CustomModal/CustomModal";

const ContributorsProfileModal = ({ open, onClose, contributor }) => {
  if (!contributor) return null;

  const { image, name, description, ethnicity, linkedIn } = contributor;

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          alignItems: "flex-start",
          padding: 3,
        }}
      >
        {/* Image Box */}
        <Box
          sx={{
            flex: "1", // Image box takes 1 part of the row
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "4px solid #ddd",
            borderRadius: "50%",
            padding: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Text Box */}
        <Box
          sx={{
            flex: "2", // Text box takes 2 parts of the row (making it half)
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#333" }}>
            {name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <span style={{ fontWeight: "bold" }}>Ethnicity: </span>
            {ethnicity}
          </Typography>

          {linkedIn && (
            <Link
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#0077b5",
                fontWeight: "bold",
                textDecoration: "none",
                marginTop: 1,
              }}
            >
              LinkedIn
            </Link>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            fontWeight: "300",
            color: "#333",
            whiteSpace: "pre-line",
            wordWrap: "break-word",
            textAlign: "left",
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Box>
    </CustomModal>
  );
};

export default ContributorsProfileModal;
