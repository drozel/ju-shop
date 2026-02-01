import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Keyboard from "./Keyboard";
import OrderList from "./OrderList";

function CashControl({ shopLogoUrl, addOrderCallback }) {
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
      } else {
        if (this.decimalPosition === -1) {
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
        } else {
          return;
        }
      }
    }
  }

  const [enteredNumber, setEnteredNumber] = useState(new NumberInput());
  const [orders, setOrders] = useState([]);

  const addOrder = (name, price) => {
    if (price === "0.00") return;
    console.log("Adding order:", name, price);
    setOrders((prevOrders) => [ { name, price }, ...prevOrders]);
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
        flexDirection: "row",
        height: "100%", // Full viewport height
        width: "95%", // Full viewport width
        overflow: "hidden", // Prevent overflow
      }}
    >
      {/* Left Column: Logo and OrderList */}
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          padding: "10px",
          flexDirection: "column", // Stack logo and order list vertically
        }}
      >
        {/* Shop Logo */}
        <Box
          sx={{
            height: "20%",
            minHeight: "100px",
            display: "flex",
            justifyContent: "center",
            padding: "10px",
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

        {/* OrderList */}
        <Box
          sx={{
            flex: 1, // Occupy remaining height
            overflowY: "auto", // Scrollable content if list is too long
          }}
        >
          <OrderList orders={orders} />
        </Box>
      </Box>

      {/* Right Column: Display and Keyboard */}
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          padding: "10px",
          flexDirection: "column",
        }}
      >
          <Box
            sx={{
              height: "20%",
              width: "95%",
              margin: "10px",
              minHeight: "80px",
              backgroundColor: "white",
              borderBottom: "1px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              fontSize: "4rem",
              fontWeight: "bold",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR' }).format(enteredNumber.toString())}
          </Box>

          {/* Keyboard Section */}
        <Box
          sx={{
            flex: 1, // Occupy remaining space
            width: "95%",
            margin: "10px",
            overflowY: "hidden", // Ensure no vertical overflow
            backgroundColor: "#f9f9f9",
            display: "flex",
            padding: "10px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <Keyboard
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
