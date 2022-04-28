import React, { useState } from "react";
import axios from "axios";

export default function SignIn() {
  console.log("in component")
  const [loading, setLoading] = useState(false);
  const startAuth = () => {
    console.log("start sign")
    setLoading(true);
    axios
      .get("/start-auth")
      .then(res => {
        console.log("data",res.data)
        if (res.data.redirectUrl) {
          console.log("in sign if condition in", res.data.redirectUrl)
          alert("removing item")
          localStorage.removeItem('codeVerifier')
          localStorage.removeItem('state')
          console.log("item1 ", localStorage.getItem("codeVerifier"), Date.now())
          console.log("item2", localStorage.getItem("state"))
          localStorage.setItem(
            "codeVerifier",
            res.data.codeVerifier
          );
          localStorage.setItem("state", res.data.state);
          console.log("item1 afet set", localStorage.getItem("codeVerifier"), Date.now())
          console.log("item2 after ser", localStorage.getItem("state"))
          alert("after set")
          window.location.href = res.data.redirectUrl;
        }
      })
      .catch(err => {
        setLoading(false);
        alert("auth error", err);
      });
  };
  return (
    <div className="App-header ">
      <h2> Twitter 3 Legged Authentication </h2>
      {loading && <h3> loading </h3>}
      {!loading && <button onClick={startAuth}> Sign In With Twitter </button>}
    </div>
  );
}