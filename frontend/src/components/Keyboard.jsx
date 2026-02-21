import React from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

function Keyboard({ handleKeyPress }) {
  const keys = [
    { label: "1", span: 1 },
    { label: "2", span: 1 },
    { label: "3", span: 1 },
    { label: "4", span: 1 },
    { label: "5", span: 1 },
    { label: "6", span: 1 },
    { label: "7", span: 1 },
    { label: "8", span: 1 },
    { label: "9", span: 1 },
    { label: "C", span: 1 },
    { label: "0", span: 1 },
    { label: ",", span: 1 },
    { label: "Enter", span: 3 },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        {keys.map((key) => (
          <Grid size={{ xs: key.span * 4 }} key={key.label}>
            <Button
              variant="contained"
              color={
                key.label === "C"
                  ? "secondary"
                  : key.label === "Enter"
                  ? "primary"
                  : "inherit"
              }
              onClick={() => handleKeyPress(key.label)}
              sx={{
                width: "100%",
                height: { xs: 56, sm: 70, md: 80 },
                fontSize: { xs: "1rem", sm: "1.15rem" },
                fontWeight: 700,
              }}
            >
              {key.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Keyboard;
