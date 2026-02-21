import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Keyboard from "./Keyboard";
import OrderList from "./OrderList";

function CashControl({ shopLogoUrl, addOrderCallback, useRomanNumerals = false }) {
  class NumberInput {
    constructor() {
      this.first = "0";
      this.second = "00";
      this.decimalPosition = -1;
      this.limit = 7;
    }

    toString() {
      return `${this.first}.${this.second}`;
    }

    add(symbol) {
      if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ","].includes(symbol)) return;

      if (symbol === ",") {
        if (this.decimalPosition === -1) this.decimalPosition = 0;
      } else if (this.decimalPosition === -1) {
        if (this.first === "0") {
          if (symbol === "0") return;
          this.first = symbol;
        } else {
          if (this.first.length === this.limit) return;
          this.first = this.first + symbol;
        }
      } else if (this.decimalPosition === 0) {
        this.second = symbol + "0";
        this.decimalPosition = 1;
      } else if (this.decimalPosition === 1) {
        this.second = this.second[0] + symbol;
        this.decimalPosition = 2;
      }
    }
  }

  const [enteredNumber, setEnteredNumber] = useState(new NumberInput());
  const [orders, setOrders] = useState([]);

  const addOrder = (name, price) => {
    if (price === "0.00") return;
    console.log("Adding order:", name, price);
    setOrders((prevOrders) => [{ name, price }, ...prevOrders]);
  };

  const removeOrder = (indexToRemove) => {
    setOrders((prevOrders) => prevOrders.filter((_, index) => index !== indexToRemove));
  };

  // Allow external components to add an order
  useEffect(() => {
    if (addOrderCallback) {
      addOrderCallback((name, price) => addOrder(name, price));
    }
  }, [addOrderCallback]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          minHeight: { xs: 260, md: "100%" },
          display: "flex",
          p: { xs: 1, sm: 1.5 },
          flexDirection: "column",
          borderBottom: { xs: "1px solid #ddd", md: "none" },
          borderRight: { xs: "none", md: "1px solid #ddd" },
        }}
      >
        <Box
          sx={{
            height: { xs: 88, sm: 110 },
            minHeight: 88,
            display: "flex",
            justifyContent: "center",
            px: 1,
            alignItems: "center",
          }}
        >
          <img
            src={shopLogoUrl}
            alt="Shop Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <OrderList orders={orders} onRemoveOrder={removeOrder} />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          minHeight: { xs: 360, md: "100%" },
          display: "flex",
          p: { xs: 1, sm: 1.5 },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            minHeight: { xs: 72, sm: 90 },
            backgroundColor: "white",
            borderBottom: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: { xs: "2rem", sm: "3rem", lg: "4rem" },
            fontWeight: "bold",
            px: { xs: 1.5, sm: 2 },
            mb: 1.5,
            overflow: "hidden",
          }}
        >
          {new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "EUR",
          }).format(enteredNumber.toString())}
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            backgroundColor: "#f9f9f9",
            display: "flex",
            p: { xs: 1, sm: 1.5 },
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <Keyboard
            useRomanNumerals={useRomanNumerals}
            handleKeyPress={(key) => {
              if (key === "C") {
                setEnteredNumber(new NumberInput());
              } else if (key === "Enter") {
                addOrder("Item", enteredNumber.toString());
                setEnteredNumber(new NumberInput());
              } else {
                setEnteredNumber((prev) => {
                  const updatedNumber = new NumberInput();
                  Object.assign(updatedNumber, prev);
                  updatedNumber.add(key);
                  return updatedNumber;
                });
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CashControl;
