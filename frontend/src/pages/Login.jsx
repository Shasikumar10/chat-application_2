import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
  } from "@mui/material";
  import { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";
  
  const Login = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", form);
        setUser(res.data);
        navigate("/home");
      } catch (err) {
        alert(err.response?.data?.message || "Login failed");
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" mb={2}>Login</Typography>
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            type="password"
            margin="normal"
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Container>
    );
  };
  
  export default Login;
  