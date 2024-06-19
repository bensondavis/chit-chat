import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Login, Register } from "../api/Auth";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthUser } = useAuthContext();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const handleClick = async () => {
    const data = !isLogin
      ? {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: password.toLowerCase(),
        }
      : { email: email.toLowerCase(), password: password.toLowerCase() };
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
            onKeyDown={(e) => {
              if(e.key === "Enter") handleClick();
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
