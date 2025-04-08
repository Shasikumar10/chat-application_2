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
  
  const Register = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/api/users/register", form);
        setUser(res.data);
        navigate("/home");
      } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
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
          <Typography variant="h5" mb={2}>Register</Typography>
          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
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
            Register
          </Button>
        </Box>
      </Container>
    );
  };
  
  export default Register;
  