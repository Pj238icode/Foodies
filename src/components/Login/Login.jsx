import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";


const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await login(data);
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        await loadCartData(response.data.token);
        toast.success("Login successful 🎉");
        navigate("/");
      } else {
        toast.error("Unable to login. Please try again.");
      }
    } catch (error) {
      console.log("Unable to login", error);
      toast.error("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back 👋</h3>
            <p className="text-center text-muted mb-4">
              Sign in to continue to <b>Fast Food</b>
            </p>

            <form onSubmit={onSubmitHandler}>
              <div className="form-floating mb-3">
                <input
                  required
                  type="email"
                  className="form-control custom-input"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  required
                  type="password"
                  className="form-control custom-input"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                />
                <label htmlFor="password">Password</label>
              </div>

              <button className="btn btn-primary w-100 py-2 mb-3 login-btn" type="submit">
                Sign In
              </button>
              <p className="text-center text-muted">
                Don’t have an account?{" "}
                <Link to="/register" className="text-decoration-none fw-bold text-danger">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
