import { Link, useNavigate } from "react-router-dom";
import HomePage from "../Pages/HomePage";
export default function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4"
      style={{
        position: "sticky",
        width: "100%",
        top: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/HomePage">
          DietApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/HomePage">
                  Home
                </Link>
              </li>
            )}

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <Link className="nav-link" to="/PlanDiet">
                    PlanDiet
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/SavedDietPlans">
                    View Saved Planes
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
