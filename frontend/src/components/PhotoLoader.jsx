import React from "react";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";

function PhotoLoader({ photo, setPhoto }) {
  // Fetch a random photo from the server
  const fetchRandomPhoto = async () => {
    const response = await fetch("/api/random-photo");
    if (response.ok) {
      const blob = await response.blob();
      const photoUrl = URL.createObjectURL(blob);
      setPhoto(photoUrl);
    } else {
      const result = await response.json();
      alert(result.error || "Failed to fetch random photo.");
    }
  };

  return (
    <Box
      sx={{
        width: "80%",
        maxWidth: "400px",
        mb: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {photo ? (
        <Card>
          <CardMedia
            component="img"
            image={photo}
            alt="Captured or Random"
            sx={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </Card>
      ) : (
        <Typography variant="body1">No photo displayed</Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchRandomPhoto}
        sx={{ mt: 2 }}
      >
        Show Random Photo
      </Button>
    </Box>
  );
}

export default PhotoLoader;
