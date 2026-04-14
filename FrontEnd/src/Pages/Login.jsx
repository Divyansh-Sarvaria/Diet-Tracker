import LoginBtn from "../Components/StyleLoginbtn.jsx";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }
      console.log(res);
      localStorage.setItem("user", JSON.stringify(result));
      localStorage.setItem("token", result.token);
      console.log("Server response:", result);
      navigate("/HomePage");
    } catch (err) {
      console.error(err);
      alert("Something went wrong", err);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="row shadow-lg rounded-4 overflow-hidden"
        style={{ width: "900px", background: "rgba(255,255,255,0.95)" }}
      >
        {/* LEFT SIDE */}
        <div className="col-6 d-flex flex-column justify-content-center p-5">
          <h1 className="fw-bold mb-3">Welcome 👋</h1>
          <p className="text-muted fs-5">
            Track your diet, stay healthy, and achieve your goals.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-6 d-flex justify-content-center align-items-center p-5">
          <div className="w-100" style={{ maxWidth: "320px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "minimum three characters",
                    },
                  })}
                />
                {errors.username && (
                  <small className="text-danger">
                    {errors.username.message}
                  </small>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>

              <div className="d-flex justify-content-center">
                <LoginBtn text="Login" />
              </div>
              <div>
                <p>
                  Dont have a account <Link to="/signup">SignUp</Link>{" "}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
