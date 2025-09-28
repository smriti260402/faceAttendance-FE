import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./Login.css";
import bcrypt from "bcryptjs";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [faceImages, setFaceImages] = useState([]); // store captured images
  const [showModal, setShowModal] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; // models in public/models
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log("Face-api.js models loaded");
      } catch (err) {
        console.error("Error loading face-api models:", err);
      }
    };
    loadModels();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Capture face image
  const captureFace = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setFaceImages(prev => {
        if (prev.length < 5) return [...prev, imageSrc];
        return prev;
      });
      if (faceImages.length + 1 >= 5) setShowModal(false);
    }
  };

  // Convert image to Float32Array embedding
  const getEmbedding = async (image) => {
    const img = new Image();
    img.src = image;
    await img.decode(); // wait until loaded
    const detection = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) throw new Error("No face detected in image");
    return Array.from(detection.descriptor); // convert Float32Array to regular array for JSON
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!modelsLoaded) {
      setError("Face-api models are not loaded yet. Try again in a moment.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (faceImages.length < 5) {
      setError("Please capture 5 face images for signup");
      return;
    }

    try {
      // Generate embeddings for all images
      const embeddings = [];
      for (let i = 0; i < faceImages.length; i++) {
        const embedding = await getEmbedding(faceImages[i]);
        embeddings.push(embedding);
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const res = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password: hashedPassword,
        role: "STAFF",
        faceEmbeddings: embeddings, // send array of embeddings
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="login-title">Sign Up</h2>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-input" />
        </div>

        <div className="form-group">
          <button type="button" className="login-button" onClick={openModal}>
            {faceImages.length === 5 ? "5 Images Captured ✅" : `Capture Face (${faceImages.length}/5)`}
          </button>
        </div>

        <button type="submit" className="login-button">Sign Up</button>
        <div className="signup-prompt">
          <span>Already have an account? </span>
          <span className="signup-link" onClick={() => navigate("/")}>Sign In</span>
        </div>
      </form>

      {showModal && (
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
              <button className="login-button" onClick={captureFace}>Capture</button>
              <button className="login-button" onClick={closeModal} style={{ backgroundColor: "#ccc", color: "#000" }}>Cancel</button>
            </div>
            <p style={{ marginTop: "10px" }}>Captured {faceImages.length} of 5 images</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
