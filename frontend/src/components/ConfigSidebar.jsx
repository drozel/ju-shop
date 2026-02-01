import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar({ options, onConfigChange, onAction }) {
  // Initialize active states for toggles
  const [activeStates, setActiveStates] = useState(
    options
      .filter((option) => option.type === "toggle")
      .reduce((acc, option) => ({ ...acc, [option.name]: false }), {})
  );

  // Handle toggles
  const toggleOption = (optionName) => {
    setActiveStates((prevState) => {
      const updatedState = { ...prevState, [optionName]: !prevState[optionName] };
      onConfigChange(updatedState); // Notify parent of the updated config
      return updatedState;
    });
  };

  // Handle actions
  const handleAction = (actionName) => {
    if (onAction) {
      onAction(actionName); // Call the parent-provided action callback
    }
  };

  return (
    <Box
      sx={{
        height: "95%", // Full viewport height
        width: "100%", // Fixed width for sidebar
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Space toggles and actions
        padding: "5px",
        paddingTop: "10px",
        overflowY: "hidden", // Prevent sidebar from growing
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto", // Allow toggles to scroll if they exceed height
          flex: 1, // Take up available space
        }}
      >
        {options.map(({ name, icon, type, gap }) => (
          <IconButton
            key={name}
            onClick={() => type == "toggle" ? toggleOption(name) : handleAction(name)}
            sx={{
              width: "60px", // Square button
              height: "60px", // Square button
              marginBottom: `${gap || 1}rem`,
              backgroundColor: activeStates[name] ? "primary.main" : "white",
              color: activeStates[name] ? "white" : "black",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: activeStates[name] ? "primary.dark" : "grey.300",
              },
            }}
          >
            <FontAwesomeIcon icon={icon} size="lg" />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

export default Sidebar;
