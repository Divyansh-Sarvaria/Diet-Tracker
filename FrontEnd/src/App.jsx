import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Pages/Login.jsx";
import LoginPage from "./Pages/Login.jsx";
import SignUp from "./Pages/SignupPage.jsx";
import Background from "./Components/Background.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Components/Background.jsx";
import HomePage from "./Pages/HomePage.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import PrivateRoute from "./Components/PrivateRouts.jsx";
import PlanDiet from "./Pages/PlanDiet.jsx";
import SavedDietPlans from "./Pages/SavedDietPlans.jsx";
<Route path="/signup" element={<SignUp />} />;
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Background />

      <div className="MainContent">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/HomePage"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PlanDiet"
            element={
              <PrivateRoute>
                <PlanDiet />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/SavedDietPlans"
            element={
              <PrivateRoute>
                <SavedDietPlans />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
