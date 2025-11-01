import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/user.context";

const API_ORIGIN = import.meta.env.VITE_AUTH_ORIGIN;

const safeJson = async (res) => {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return { _text: text };
};

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });

  const onFormInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("SIGNUP ->", `${API_ORIGIN}/auth/signup`);
      const signupRes = await fetch(`${API_ORIGIN}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const signupBody = await safeJson(signupRes);
      console.log("SIGNUP status", signupRes.status, "body", signupBody);

      if (signupRes.status === 409) {
        alert(signupBody?.error || "Email already in use");
        return;
      }
      if (!signupRes.ok) {
        throw new Error(
          signupBody?.error ||
            signupBody?._text ||
            `Signup failed (${signupRes.status})`
        );
      }

      console.log("LOGIN ->", `${API_ORIGIN}/auth/login`);
      const loginRes = await fetch(`${API_ORIGIN}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginBody = await safeJson(loginRes);
      console.log("LOGIN status", loginRes.status, "body", loginBody);

      if (!loginRes.ok) {
        throw new Error(
          loginBody?.error ||
            loginBody?._text ||
            `Login after signup failed (${loginRes.status})`
        );
      }

      if (loginBody?.token) localStorage.setItem("token", loginBody.token);
      if (loginBody?.user) {
        // update context and go home
        // import { useUser } from "../Contexts/user.context";
        // const { setUser } = useUser();
        setUser(loginBody.user);
      }
      redirectNow();
    } catch (err) {
      console.error(err);
      alert(err.message || String(err));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      <h1>Signup</h1>

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        name="email"
        value={form.email}
        onChange={onFormInputChange}
        style={{ marginBottom: "1rem" }}
        required
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        name="password"
        value={form.password}
        onChange={onFormInputChange}
        style={{ marginBottom: "1rem" }}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          border: "1px solid #47474782",
          borderRadius: "25px",
          display: "flex",
          justifyContent: "center",
          padding: "0.5em 3em",
          color: "white",
          marginTop: "1vw",
          width: "4vw",
          textTransform: "capitalize",
          maxWidth: "60px",
          maxHeight: "30px",
          fontWeight: "bold",
          boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
        }}
      >
        Signup
      </Button>

      <p>
        Have an account already? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Signup;
