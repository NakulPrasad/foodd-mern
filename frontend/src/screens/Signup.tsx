import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URLs } from "../configs/URLs";

const Signup = () => {
  let navigate = useNavigate();

  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });

  const handleSubmit = async (e) => {

    e.preventDefault(); 

    const response = await fetch(
      URLs.addUser,
      {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
        }),
      }
    );
    const json = await response.json();

    if (!json.success) {
      alert("Enter vaild credentials");
    }
    if (json.success) {
      alert("User Created !!\nTry Login !!");
      navigate("/");
    }
  };
  const onChange = (event) => {

    setcredentials({ ...credentials, [event.target.name]: event.target.value });
  };
  return (
    <div className="container mt-5">

      <form onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form2Example1">
            Enter Name
          </label>

          <input
            type="text"
            className="form-control"
            name="name"
            value={credentials.name}
            onChange={onChange}
          />
        </div>

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

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form2Example4">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            name="geolocation"
            value={credentials.geolocation}
            onChange={onChange}
          />
        </div>

        <div className="row mb-4">
          <div className="col">
            <Link to="#!">Forgot password?</Link>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block m-3">
          Sign Up
        </button>
        <Link to="/login" className="btn btn-danger btn-block m-3">
          Already a user?
        </Link>
      </form>
    </div>
  );
};

export default Signup;
