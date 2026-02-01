import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Fab, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { faCog, faEye, faCamera, faKeyboard, faPlus, faShop } from "@fortawesome/free-solid-svg-icons";


import PhotoLoader from "./components/PhotoLoader";
import Keyboard from "./components/Keyboard";
import CameraDialog from "./components/CameraDialog";
import ConfigSidebar from "./components/ConfigSidebar";
import CashControl from "./components/CashControl";
import Barcode from "./components/Barcode";

const prices = [0.50, 10.99, 50.00, 99.99, 11.50, 0.99, 100.00, 512.00, 10000.00, 1.99, 5.99, 9.15, 995.60, 34.50];

function App() {
  const [photo, setPhoto] = useState(null); // Stores the photo to display
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Controls camera visibility
  const [onDisplayPrice, setOnDisplayPrice] = useState("");
  const [shopLogoUrl, setShopLogoUrl] = useState("/api/next-logo");

  const addOrderRef = useRef(null);

  const [sidebarConfig, setSidebarConfig] = useState({
    Camera: false,
    Keyboard: false,
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
    setSidebarConfig(config);
  };

  const options = [
    //{ name: "Camera", icon: faCamera, type: "toggle", gap: 20},
    { name: "Logo", icon: faShop, type: "action", gap: 20},
    //{ name: "Add", icon: faPlus, type: "action" },
  ];

  // Load initial logo and configuration from localStorage when the app starts
  useEffect(() => {
    // Load initial logo from API
    setShopLogoUrl("/api/next-logo");
    
    const savedConfig = localStorage.getItem("appConfig");
    if (savedConfig) {
      handleConfigChange(JSON.parse(savedConfig)); // Parse JSON string and update state
    }
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appConfig", JSON.stringify(sidebarConfig));
  }, [sidebarConfig]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
      }}
    >
       {/* Sidebar */}

      <Box sx={{ flex: "100% 0 7%", backgroundColor: "#f0f0f0" }}>
        <ConfigSidebar
          options={options} // Pass button labels
          onConfigChange={handleConfigChange}
          onAction={handleAction}
        />
      </Box>
    
      <CameraDialog
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onTakePhoto={handleTakePhoto}
      />
  
    <CashControl
      addOrderCallback={(callback) => (addOrderRef.current = callback)}
      shopLogoUrl={shopLogoUrl}
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
