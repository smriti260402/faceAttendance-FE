// src/components/MarkAttendance.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./MarkAttendance.css";

const MarkAttendance = ({ userId, onClose }) => {
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api.js models once
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // make sure models are in public/models
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const captureAndVerify = async () => {
    if (!modelsLoaded) {
      setMessage("Models are still loading, please wait...");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("No image captured");
      return;
    }

    try {
      // Convert image to HTMLImageElement
      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      // Detect face and compute embedding
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("No face detected");
        return;
      }

      const embedding = Array.from(detection.descriptor); // convert Float32Array to array

      // Send embedding to backend
      const res = await axios.post("http://localhost:5000/attendance/mark", {
        userId,
        embedding,
      });

      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error marking attendance");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={250}
          videoConstraints={{ facingMode: "user" }}
        />
        <div className="modal-buttons">
          <button className="attendance-button" onClick={captureAndVerify}>
            Capture & Verify
          </button>
          <button className="attendance-button cancel" onClick={onClose}>
            Close
          </button>
        </div>
        {message && <p className="attendance-message">{message}</p>}
      </div>
    </div>
  );
};

export default MarkAttendance;
