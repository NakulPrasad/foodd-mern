import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URLs } from "../configs/URLs";

const Login = () => {
  const [credentials, setcredentials] = useState({ email: "", password: "" });

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(URLs.loginUser);
      const response = await fetch(URLs.loginUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      console.log(JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),);
      if (!json.success) {
        alert("Enter vaild credentials");
      }

      if (json.success) {
        localStorage.setItem("authToken", json.authToken);

        localStorage.setItem("userEmail", credentials.email);

        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value });
  };
  return (
    <div>
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="form2Example3">
              Email address
            </label>
            <input
              type="email"
              id="form2Example1"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
          </div>

          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="form2Example2">
              Password
            </label>
            <input
              type="password"
              id="form2Example2"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>

          <div className="row mb-4">
            <div className="col">
              <Link to="#!">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block m-3">
            Login
          </button>
          <Link to="/createuser" className="btn btn-danger btn-block m-3">
            I'm a new user
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
