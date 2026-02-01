import React, { useState, useEffect } from "react";
import BarcodeReader from "react-barcode-reader";
import { Dialog, DialogActions, DialogContent, Button, Typography } from "@mui/material";

const prices = [0.50, 10.99, 50.00, 99.99, 11.50, 0.99, 100.00, 512.00, 10000.00, 1.99, 5.99, 9.15, 995.60, 34.50, 10000.00];

function BarcodeScanner({ onScan }) {
  const [open, setOpen] = useState(false); // Controls the pop-up visibility
  const [scannedSum, setScannedSum] = useState(""); // Stores the scanned sum
  const [secondsLeft, setSecondsLeft] = useState(5); // Timeout countdown
  const [timeoutId, setTimeoutId] = useState(null); // Stores the timeout ID

  const handleScan = (data) => {
    if (timeoutId !== null) {
      console.log("Ignoring scan while a dialog open");
      return;
    }

    if (data) {
      console.log("Barcode detected:", data);
      const hash = Array.from(data).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = hash % prices.length;
      const price = prices[index].toFixed(2);

      console.log("Price would be:", price);

      setScannedSum(price); // Set the scanned sum
      setOpen(true); // Open the pop-up
      setSecondsLeft(5); // Reset the countdown

      // Start the countdown timer
      const id = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            clearInterval(id);
            handleClose(price); // Close the pop-up when countdown finishes
          }
          return prev - 1;
        });
      }, 1000);
      setTimeoutId(id);
    }
  };

  const handleError = (err) => {
    console.error("Barcode Scan Error:", err);
  };

  const handleClose = (data) => {
    setOpen(false); // Close the pop-up
    clearTimeout(timeoutId);
    setTimeoutId(null);
    setSecondsLeft(5); // Reset the countdown
    onScan(data); // Emit the scanned event
  };

  return (
    <div>
      <BarcodeReader
        onError={handleError}
        onScan={handleScan}
      />

      {/* Pop-up Dialog */}
      <Dialog
        open={open}
        onClose={() => handleClose(scannedSum)}
        sx={{
          "& .MuiDialog-paper": {
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          },
        }}
      >
        <DialogContent>
          {/* Large sum display */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "black",
              marginBottom: "20px",
            }}
          >
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR' }).format(scannedSum.toString())}
          </Typography>
          {/* Countdown info */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose(scannedSum)}
            variant="contained"
            color="primary"
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#145a8c",
              },
            }}
          >
            OK ({secondsLeft}s)
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BarcodeScanner;
