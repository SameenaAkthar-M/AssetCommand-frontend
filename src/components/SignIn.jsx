import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://assetcommand.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "base_commander") navigate("/commander");
      else if (data.user.role === "logistics_officer") navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-image">
        <img src="/indian_army.jpg" alt="Sign In" />
      </div>
      <div className="auth-form-container">
        <h1>Welcome to AssetCommand ⚔️</h1>
        <h2 className="auth-title">Sign In</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
