import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const API_URI = process.env.REACT_APP_API_URI;

  const handleClick = async () => {
    const url = `${API_URI}/auth/${isLogin ? "login" : "register"}`;
    const data = !isLogin ? { username, email, password } : { email, password };
    setEmail("");
    setUsername("");
    setPassword("");

    axios
      .post(url, data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <Box className="w-80">
      <Stack flexDirection={"column"} gap={2} alignItems={"center"}>
        <TextField
          variant="outlined"
          label="Email"
          className="w-full"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        {!isLogin ? (
          <TextField
            variant="outlined"
            label="Username"
            className="w-full"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        ) : null}
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          className="w-full"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          type="submit"
          variant="contained"
          className="w-3/5"
          onClick={handleClick}
        >
          {isLogin ? "Login" : "Register"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthPage;
