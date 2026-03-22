import React from "react";
import { Alert } from "@mui/material";

const ImageNoticeBanner = () => (
  <Alert
    severity="success"
    variant="filled"
    role="status"
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20000,
      borderRadius: 0,
      py: { xs: 1, sm: 1.25 },
      px: { xs: 1.5, sm: 2 },
      justifyContent: "center",
      "& .MuiAlert-message": {
        width: "100%",
        maxWidth: 960,
        margin: "0 auto",
        textAlign: "center",
        fontSize: { xs: "0.8125rem", sm: "0.9375rem" },
        lineHeight: 1.45,
      },
    }}
  >
    Broken images have been fixed as of March 22
  </Alert>
);

export default ImageNoticeBanner;
