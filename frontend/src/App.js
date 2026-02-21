import React, { useState, useEffect, useRef } from "react";
import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import { faLanguage, faShop } from "@fortawesome/free-solid-svg-icons";

import CameraDialog from "./components/CameraDialog";
import ConfigSidebar from "./components/ConfigSidebar";
import CashControl from "./components/CashControl";
import Barcode from "./components/Barcode";

function App() {
  const [photo, setPhoto] = useState(null); // Stores the photo to display
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Controls camera visibility
  const [shopLogoUrl, setShopLogoUrl] = useState("/api/next-logo");
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const addOrderRef = useRef(null);

  const [sidebarConfig, setSidebarConfig] = useState({
    RomanNumerals: false,
  });

  const handleAction = (action) => {
    if (action === "Add") setIsCameraOpen(true);
    if (action === "Logo") {
      // Fetch next logo from API - add timestamp to force refresh
      setShopLogoUrl(`/api/next-logo?t=${Date.now()}`);
    }
  };

  const handleTakePhoto = (dataUri) => {
    setPhoto(dataUri);
    setIsCameraOpen(false);
  };

  const handleConfigChange = (config) => {
    setSidebarConfig((prevConfig) => ({ ...prevConfig, ...config }));
  };

  const options = [
    { name: "Logo", icon: faShop, type: "action", gap: 20 },
    { name: "RomanNumerals", icon: faLanguage, type: "toggle" },
  ];

  // Load initial logo and configuration from localStorage when the app starts
  useEffect(() => {
    setShopLogoUrl("/api/next-logo");

    const savedConfig = localStorage.getItem("appConfig");
    if (savedConfig) {
      setSidebarConfig((prevConfig) => ({ ...prevConfig, ...JSON.parse(savedConfig) }));
    }

    const savedFooterVisibility = localStorage.getItem("footerVisible");
    if (savedFooterVisibility !== null) {
      setIsFooterVisible(savedFooterVisibility === "true");
    }
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appConfig", JSON.stringify(sidebarConfig));
  }, [sidebarConfig]);

  useEffect(() => {
    localStorage.setItem("footerVisible", String(isFooterVisible));
  }, [isFooterVisible]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#f4f4f4",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          flexDirection: { xs: "column", sm: "row" },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 84 },
            flexShrink: 0,
            backgroundColor: "#f0f0f0",
            borderBottom: { xs: "1px solid #ddd", sm: "none" },
            borderRight: { xs: "none", sm: "1px solid #ddd" },
          }}
        >
          <ConfigSidebar
            options={options}
            activeStates={sidebarConfig}
            onConfigChange={handleConfigChange}
            onAction={handleAction}
          />
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
          <CashControl
            addOrderCallback={(callback) => (addOrderRef.current = callback)}
            shopLogoUrl={shopLogoUrl}
            useRomanNumerals={sidebarConfig.RomanNumerals}
          />
        </Box>
      </Box>

      {isFooterVisible && (
        <Box
          component="footer"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            px: { xs: 2, sm: 3 },
            py: 1.5,
            borderTop: "1px solid #ddd",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <Link href="https://vit.sh" target="_blank" rel="noopener noreferrer" underline="hover">
              vit.sh
            </Link>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              component="a"
              href="https://www.paypal.com/donate/?hosted_button_id=MLQB6EGLS4EJN"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy me a coffee
            </Button>
            <IconButton
              size="small"
              aria-label="Close footer"
              onClick={() => setIsFooterVisible(false)}
            >
              X
            </IconButton>
          </Box>
        </Box>
      )}

      <CameraDialog
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onTakePhoto={handleTakePhoto}
      />

      <Barcode
        onScan={(data) => {
          if (addOrderRef.current) {
            console.log("Scanned Item:", data);
            addOrderRef.current("Scanned Item", data);
          }
        }}
      />
    </Box>
  );
}

export default App;
