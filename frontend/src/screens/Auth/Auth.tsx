/**
 * Not In Use, For Testing OAuth Google Login
 */


import React, { useEffect, useState } from "react";

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
      credentials: "include",
    })
    .then((response) => response.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));

      console.log("user", user);
      
    }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleLogout = () => {
    fetch("http://localhost:3000/auth/logout", {
      credentials: "include",
    }).then(() => setUser(null));
  };

  return (
    <div>
      <h1>Google Authentication with Passport.js</h1>
      <button onClick={()=>console.log(user)}>print</button>
      {user ? (
        <div>
        <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
        </div>
      );
    }
    
    export default Auth;


