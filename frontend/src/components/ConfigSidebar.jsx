import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar({ options, onConfigChange, onAction }) {
  const [activeStates, setActiveStates] = useState(
    options
      .filter((option) => option.type === "toggle")
      .reduce((acc, option) => ({ ...acc, [option.name]: false }), {})
  );

  const toggleOption = (optionName) => {
    setActiveStates((prevState) => {
      const updatedState = { ...prevState, [optionName]: !prevState[optionName] };
      onConfigChange(updatedState);
      return updatedState;
    });
  };

  const handleAction = (actionName) => {
    if (onAction) {
      onAction(actionName);
    }
  };

  return (
    <Box
      sx={{
        height: { xs: "auto", sm: "100%" },
        width: "100%",
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: { xs: "row", sm: "column" },
        justifyContent: { xs: "flex-start", sm: "space-between" },
        p: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          alignItems: "center",
          overflowX: { xs: "auto", sm: "hidden" },
          overflowY: { xs: "hidden", sm: "auto" },
          gap: 1,
          flex: 1,
        }}
      >
        {options.map(({ name, icon, type }) => (
          <IconButton
            key={name}
            onClick={() => (type === "toggle" ? toggleOption(name) : handleAction(name))}
            sx={{
              width: { xs: 48, sm: 60 },
              height: { xs: 48, sm: 60 },
              flexShrink: 0,
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
