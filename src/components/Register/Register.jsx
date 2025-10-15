import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration successful! Please login now.");
        navigate("/login");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (error) {
      toast.error("Unable to register. Please try again.");
    }
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="register-card shadow-lg">
        <h3 className="text-center mb-4 text-primary">Create Account</h3>
        <form onSubmit={onSubmitHandler}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingName"
              placeholder="John Doe"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
            <label htmlFor="floatingName">Full Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
            <label htmlFor="floatingEmail">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign Up
          </button>
          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
