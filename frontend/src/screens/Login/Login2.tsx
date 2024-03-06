import React, { useState } from "react";// @ts-ignore
import emailIcon from "../../assets/email.png"; // @ts-ignore
import passwordIcon from "../../assets/password.png";// @ts-ignore
import personIcon from "../../assets/person.png";
import "./Login2.css";

const Login2 = () => {
  const[action, setAction] = useState("Sign Up");

  return (
    <section className="flex-container flexbox" id="login">
      <div className="form-container">
        <div className="header flexbox">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Sign Up" && <div className="input">
            <img src={personIcon} alt="person" />
            <input type="text" placeholder="Name" />
          </div>}
         
          <div className="input">
            <img src={emailIcon} alt="email" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="input">
            <img src={passwordIcon} alt="password" />
            <input type="password" placeholder="Password" />
          </div>
          {action === "Sign Up" && <div className="input">
            <img src={passwordIcon} alt="password" />
            <input type="text" placeholder="Address" />
          </div>}
          
        </div>
      </div>
    {action === "Sign Up" && <div className="forgot-password">
        Lost Password ? <span> Click Here </span>
      </div>}
      
      <div className="submit-container flexbox">
        <button className={action === "Login"? "gray submit" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</button>
        <button className={action === "Sign Up"? "gray submit" : "submit"} onClick={() => setAction("Login")}>Login</button>
      </div>
    </section>
  );
};

export default Login2;
