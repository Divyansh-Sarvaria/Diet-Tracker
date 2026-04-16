import LoginBtnStyling from "../Components/StyleLoginbtn";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../Components/SignUpStyle.css";
export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [fromData, setFromData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
  };
  const apiSubmit = async (data) => {
    try {
      const res = await fetch(
        "https://diet-tracker-tbn5.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // 🔥 use validated data
        },
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }
      reset();
      navigate("/");
      alert("Signup Successful");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center signup-container">
      {" "}
      <div className="row shadow-lg rounded-4 overflow-hidden signup-card">
        {" "}
        {/* Left Section */}
        <div className="col-6 d-flex flex-column justify-content-center align-items-center p-5 bg-primary text-white signup-left">
          {" "}
          <h1 className="fw-bold mb-3">Create Account</h1>
          <p className="text-center">Join us and start your journey today 🚀</p>
        </div>
        {/* Right Section */}
        <div className="col-6 d-flex flex-column justify-content-center p-5 signup-right">
          {" "}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="form-control form-control-lg"
              onChange={handleChange}
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "minimum three characters",
                },
              })}
            />
            {errors.username && (
              <small className="text-danger">{errors.username.message}</small>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control form-control-lg"
              onChange={handleChange}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 3,
                  message: "minimum three characters",
                },
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}{" "}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control form-control-lg"
              onChange={handleChange}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>
          <LoginBtnStyling
            text="Create New Account"
            onClick={handleSubmit(apiSubmit)}
          />
        </div>
      </div>
    </div>
  );
}
