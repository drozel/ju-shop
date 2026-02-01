import React from "react";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

function Keyboard({ handleKeyPress }) {
  // Keys with their respective column span
  const keys = [
    { label: "1", span: 1 }, // 1 column
    { label: "2", span: 1 }, // 1 column
    { label: "3", span: 1 }, // 1 column
    { label: "4", span: 1 }, // 1 column
    { label: "5", span: 1 }, // 1 column
    { label: "6", span: 1 }, // 1 column
    { label: "7", span: 1 }, // 1 column
    { label: "8", span: 1 }, // 1 column
    { label: "9", span: 1 }, // 1 column
    { label: "C", span: 1 }, // 2 columns
    { label: "0", span: 1 }, // 1 column
    { label: ",", span: 1 }, // 1 column
    { label: "Enter", span: 3  }, // 3 columns (entire row)
  ];

  return (
    <Grid container spacing={2}>
      {keys.map((key) => (
        <Grid size={{xs: key.span* 4}} key={key.label}>
          <Button
            variant="contained"
            color={
              key.label === "C"
                ? "secondary"
                : key.label === "Enter"
                ? "primary"
                : "default"
            }
            onClick={() => handleKeyPress(key.label)}
            sx={{
              width: "100%",
              height: "80px",
            }}
          >
            {key.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default Keyboard;