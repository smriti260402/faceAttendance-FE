import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import bcrypt from "bcryptjs";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password: hashedPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      loginUser(res.data.user, res.data.token);

      // Check if admin
      if (res.data.user.email === "admin@gmail.com") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign In failed");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="signin-signup">
          <button type="submit" className="login-button">Sign In</button>
          <div className="signup-prompt">
            <span>Do not have an account? </span>
            <span className="signup-link" onClick={() => navigate("/signup")}>
              Create Account
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
