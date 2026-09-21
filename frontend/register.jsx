import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart3,
  UserPlus
} from "lucide-react";
import "./register.css";
import "./auth-themes.css";

export default function Register({ onRegister, onBackToLogin }) {
  React.useEffect(() => {
    const theme = localStorage.getItem("statSkillVisualTheme") || "solo";
    const appearance = localStorage.getItem("statSkillAppearance") || "dark";
    document.documentElement.dataset.themeMode = theme;
    document.documentElement.dataset.appearanceMode = appearance;
    document.body.classList.remove("theme-solo","theme-executive","theme-aurora","appearance-dark","appearance-light");
    document.body.classList.add(`theme-${theme === "pro" ? "executive" : theme}`, `appearance-${appearance}`);
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all the fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Registration successful
    if (onRegister) {
      onRegister(formData);
    }
  };

  return (
    <div className="register-page">
      {/* LEFT BRANDING SECTION */}
      <div className="register-brand">
        <div className="register-brand-lockup">

        <div className="register-brand-icon">
          <BarChart3 size={28} />
        </div>

        <div className="register-brand-content">

          <h1>StatSkill AI</h1>

          <p className="register-tagline">
            AI-Powered Competency & Learning Platform
          </p>

          <p className="register-description">
            Build your skills, track your competency and follow
            personalized learning paths powered by AI.
          </p>

          <div className="register-project">
            SIH26101
            <span>•</span>
            MoSPI
          </div>

        </div>

        </div>

      </div>


      {/* RIGHT REGISTRATION SECTION */}
      <div className="register-form-section">

        <div className="register-form-container">

          <div className="register-heading">
            <h2>Create Account</h2>

            <p>
              Register to start your learning journey
            </p>
          </div>


          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <div className="register-field">

              <label>Full Name</label>

              <div className="register-input-wrapper">

                <User
                  size={20}
                  className="register-input-icon"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="register-field">

              <label>Email Address</label>

              <div className="register-input-wrapper">

                <Mail
                  size={20}
                  className="register-input-icon"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="register-field">

              <label>Password</label>

              <div className="register-input-wrapper">

                <Lock
                  size={20}
                  className="register-input-icon"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="register-field">

              <label>Confirm Password</label>

              <div className="register-input-wrapper">

                <Lock
                  size={20}
                  className="register-input-icon"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>


            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="register-submit-button"
            >
              <UserPlus size={19} />

              <span>Create Account</span>

              <ArrowRight size={20} />

            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="register-login-section">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={onBackToLogin}
              className="back-login-button"
            >
              Sign In
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
