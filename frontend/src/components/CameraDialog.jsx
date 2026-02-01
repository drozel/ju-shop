import React from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { Dialog } from "@mui/material";

function CameraDialog({ isOpen, onClose, onTakePhoto }) {
  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Camera
        onTakePhoto={(dataUri) => onTakePhoto(dataUri)} // Photo capture callback
        isFullscreen={false}
      />
    </Dialog>
  );
}

export default CameraDialog;
