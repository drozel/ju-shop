import React from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ROMAN_NUMERAL_MAP = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  0: "0",
};

function Keyboard({ handleKeyPress, useRomanNumerals = false }) {
  const keys = [
    { value: "1", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[1] : "1", span: 1 },
    { value: "2", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[2] : "2", span: 1 },
    { value: "3", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[3] : "3", span: 1 },
    { value: "4", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[4] : "4", span: 1 },
    { value: "5", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[5] : "5", span: 1 },
    { value: "6", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[6] : "6", span: 1 },
    { value: "7", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[7] : "7", span: 1 },
    { value: "8", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[8] : "8", span: 1 },
    { value: "9", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[9] : "9", span: 1 },
    { value: "R", label: "R", span: 1 },
    { value: "0", label: useRomanNumerals ? ROMAN_NUMERAL_MAP[0] : "0", span: 1 },
    { value: ",", label: ",", span: 1 },
    { value: "Enter", label: "Enter", span: 3 },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        {keys.map((key) => (
          <Grid size={{ xs: key.span * 4 }} key={key.value}>
            <Button
              variant="contained"
              color={
                key.value === "C"
                  ? "secondary"
                  : key.value === "Enter"
                  ? "primary"
                  : "inherit"
              }
              onClick={() => handleKeyPress(key.value)}
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
