import React, { useState } from "react";
import {
  BarChart3,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import "./login.css";
import "./auth-themes.css";

export default function Login({ onLogin, onRegister }) {
  React.useEffect(() => {
    const theme = localStorage.getItem("statSkillVisualTheme") || "solo";
    const appearance = localStorage.getItem("statSkillAppearance") || "dark";
    document.documentElement.dataset.themeMode = theme;
    document.documentElement.dataset.appearanceMode = appearance;
    document.body.classList.remove("theme-solo","theme-executive","theme-aurora","appearance-dark","appearance-light");
    document.body.classList.add(`theme-${theme === "pro" ? "executive" : theme}`, `appearance-${appearance}`);
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ananya.verma@demo.gov.in");
  const [password, setPassword] = useState("Demo@12345");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    if (onLogin) {
      await onLogin({
        email,
        password,
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-circle circle-one"></div>
      <div className="login-background-circle circle-two"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-brand-section">

          <div className="brand-logo">
            <BarChart3 size={28} />
          </div>

          <h1>StatSkill AI</h1>

          <p className="brand-subtitle">
            AI-Powered Competency & Learning Platform
          </p>

          <div className="brand-description">
            <p>
              Build your skills, track your competency and follow
              personalized learning paths powered by AI.
            </p>
          </div>

          <div className="brand-info">
            <span>SIH26101</span>
            <span>•</span>
            <span>MoSPI</span>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="login-card">

          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="login-field">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert("Password reset functionality coming soon.")
                  }
                >
                  Forgot Password?
                </button>

              </div>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* REMEMBER */}
            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>Remember me</span>

              </label>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>

          </form>

          {/* REGISTER */}
          <div className="register-section">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              className="register-button"
              onClick={onRegister}
            >
              <UserPlus size={16} />
              Create Account
            </button>

          </div>

          <div className="login-footer">
            <span>StatSkill AI</span>
            <span>•</span>
            <span>Secure Learning Platform</span>
          </div>

        </div>

      </div>

    </div>
  );
}