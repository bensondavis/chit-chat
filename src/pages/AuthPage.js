import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { Login, Register } from "../api/Auth";

const AuthPage = ({ setUsername }) => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { authUser, setAuthUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";
  const API_URI = process.env.REACT_APP_API_URI;

  const handleClick = async () => {
    const data = !isLogin ? { username, email, password } : { email, password };
    setEmail("");
    setUserName("");
    setPassword("");

    isLogin ? Login(data, setAuthUser) : Register(data);
  };

  return (
    <div className="w-full h-full flex align-center justify-center">
      <Box className="w-80 mt-[25vh]">
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
                setUserName(e.target.value);
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
          {isLogin ? (
            <p>
              New User? <Link to={"/register"}>Register here.</Link>
            </p>
          ) : (
            <p>
              Already a user? <Link to={"/login"}>Login here.</Link>
            </p>
          )}
        </Stack>
      </Box>
    </div>
  );
};

export default AuthPage;
