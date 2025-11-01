import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/user.context";

// You can set this via env later, e.g. VITE_AUTH_ORIGIN=http://localhost:5001
const API_ORIGIN = import.meta.env.VITE_AUTH_ORIGIN;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // from our simple context: { user, setUser }
  const { user, setUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  // if already logged in, go home
  useEffect(() => {
    if (user) redirectNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("LOGIN ->", `${API_ORIGIN}/auth/login`);
      const res = await fetch(`${API_ORIGIN}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Invalid username/password. Try again!");
          return;
        }
        const msg = await res.text();
        throw new Error(msg || `Login failed with ${res.status}`);
      }

      const data = await res.json(); // expect { token, user: { id, email } }
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        setUser(data.user);
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
      <h1>Login</h1>

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
          padding: "0.5em 3em 0.5em 3em",
          color: "white",
          marginTop: "1vw",
          width: "4vw",
          textTransform: "capitalize",
          textTransformWeight: "bold",
          textTransformSize: "15px",
          maxWidth: "60px",
          maxHeight: "30px",
          fontWeight: "bold",
          boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
        }}
      >
        Login
      </Button>

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
