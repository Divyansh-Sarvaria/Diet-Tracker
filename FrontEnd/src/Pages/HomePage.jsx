import Button from "../Components/HomePageButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diet, setDiet] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/diet/getdiet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDiet(data);
      })
      .catch((err) => console.error(err));
  }, [token]);
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="container-fluid p-0"
      style={{ height: "100vh", overflow: "hidden", background: "white" }}
    >
      <div className="row g-0" style={{ height: "100%" }}>
        {/* LEFT PANEL - FULL LEFT SIDE */}
        <div className="col-12 col-md-5 p-0" style={{ height: "100%" }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              color: "white",
              display: "flex",
              flexDirection: "column",
              padding: "25px 35px",
              overflow: "hidden",
            }}
          >
            {/* Dark Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // background:
                //   "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)",
                zIndex: 1,
              }}
            />

            {/* Content - Fixed Layout without scroll */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Top Section */}
              <div>
                {/* Logo/Header */}
                <div style={{ marginBottom: "20px" }}>
                  <h1
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "800",
                      background:
                        "linear-gradient(135deg, #fff 0%, #a8e063 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "5px",
                      lineHeight: 1.2,
                    }}
                  >
                    DietApp
                  </h1>
                  <p style={{ opacity: 0.7, fontSize: "0.95rem", margin: 0 }}>
                    Your Personal Nutrition Companion
                  </p>
                </div>

                {/* Welcome Message */}
                <div style={{ marginBottom: "20px" }}>
                  <h2
                    style={{
                      fontWeight: "700",
                      fontSize: "1.8rem",
                      marginBottom: "10px",
                      lineHeight: 1.2,
                    }}
                  >
                    Welcome Back 👋
                  </h2>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "1.1rem" }}>
                      <strong>{user?.name || "Guest"}</strong>
                    </p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        opacity: 0.7,
                        fontSize: "0.85rem",
                      }}
                    >
                      {user?.membership || "Free"} • {user?.streak || 0}
                    </p>
                  </div>
                </div>

                {/* Stats Preview */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
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
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <p
                        style={{ margin: 0, opacity: 0.6, fontSize: "0.75rem" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        style={{
                          margin: "3px 0 0 0",
                          fontSize: "1.1rem",
                          fontWeight: "700",
                        }}
                      >
                        {stat.value}
                        <span
                          style={{
                            opacity: 0.5,
                            fontSize: "0.8rem",
                            marginLeft: "3px",
                          }}
                        >
                          {stat.sub}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote - Pushed to bottom */}
              <div>
                <p
                  style={{
                    fontStyle: "italic",
                    opacity: 0.7,
                    borderLeft: "3px solid #a8e063",
                    paddingLeft: "12px",
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  "Track your diet, calculate calories, and stay healthy."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - STACKED BUTTONS */}
        <div className="col-12 col-md-7 p-0" style={{ height: "100%" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px",
              overflow: "hidden",
            }}
          >
            <div style={{ maxWidth: "450px", width: "100%" }}>
              {/* Header */}
              <div style={{ marginBottom: "25px", textAlign: "center" }}>
                <h3
                  style={{
                    color: "#1a1a1a",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                    marginBottom: "5px",
                    lineHeight: 1.2,
                  }}
                >
                  What would you like to do?
                </h3>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                  Choose an option below to get started
                </p>
              </div>

              {/* Stacked Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Button
                  text="PLAN DIET"
                  onClick={() => navigate("/PlanDiet")}
                />
                <Button text="View Saved Diet Plan" />
                <Button text="FEEDBACK" />

                {/* Quick Stats */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      color: "#666",
                      fontWeight: "500",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                    }}
                  >
                    QUICK STATS
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#1a1a1a",
                        }}
                      >
                        128
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "0.7rem",
                          color: "#888",
                        }}
                      >
                        Meals Logged
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#1a1a1a",
                        }}
                      >
                        45
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "0.7rem",
                          color: "#888",
                        }}
                      >
                        Days Active
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#1a1a1a",
                        }}
                      >
                        65%
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "0.7rem",
                          color: "#888",
                        }}
                      >
                        Goal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
