import Button from "../Components/HomePageButton";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../Components/HomePageStyle.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diet, setDiet] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("https://diet-tracker-tbn5.onrender.com/diet/getdiet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDiet(data))
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("https://diet-tracker-tbn5.onrender.com/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem("token"));
  }, [token]);

  if (!token) return <Navigate to="/" replace />;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="homepage-wrapper">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="left-panel-inner">
          {/* Top Section */}
          <div className="left-top-section">
            {/* Logo/Header */}
            <div className="logo-wrapper">
              <h1 className="app-title">DietApp</h1>
              <p className="app-subtitle">Your Personal Nutrition Companion</p>
            </div>

            {/* Welcome Message */}
            <div className="welcome-section">
              <h2 className="welcome-heading">Welcome Back 👋</h2>
              <div className="user-card">
                <p className="user-card-name">
                  <strong>{user?.name || "Guest"}</strong>
                </p>
                <p className="user-card-meta">
                  {user?.membership || "Free"} • {user?.streak || 0}
                </p>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="stats-grid">
              {[
                {
                  label: "Daily Calories",
                  value: diet?.plan?.totals?.calories || "0",
                  sub: "/2,000",
                },
                {
                  label: "Protein",
                  value: diet?.plan?.totals?.protein || "0g",
                  sub: "/120g",
                },
              ].map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <p className="stat-card-label">{stat.label}</p>
                  <p className="stat-card-value">
                    {stat.value}
                    <span className="stat-card-sub">{stat.sub}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="left-quote">
            <p className="quote-text">
              "Track your diet, calculate calories, and stay healthy."
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="right-panel-inner">
          {/* Header */}
          <div className="right-panel-header">
            <h3 className="section-heading">What would you like to do?</h3>
            <p className="section-subheading">
              Choose an option below to get started
            </p>
          </div>

          {/* Stacked Buttons */}
          <div className="buttons-stack">
            <Button text="PLAN DIET" onClick={() => navigate("/PlanDiet")} />
            <Button
              text="View Saved Diet Plan"
              onClick={() => navigate("/SavedDietPlans")}
            />

            {/* Quick Stats */}
            <div className="quick-stats-box">
              <p className="quick-stats-title">QUICK STATS</p>
              <div className="quick-stats-row">
                {[
                  { value: "128", label: "Meals Logged" },
                  { value: "45", label: "Days Active" },
                  { value: "65%", label: "Goal" },
                ].map((item, idx) => (
                  <div key={idx} className="quick-stat-item">
                    <p className="quick-stat-value">{item.value}</p>
                    <p className="quick-stat-label">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
