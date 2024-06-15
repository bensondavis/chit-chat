import { Box, Button } from "@mui/material";
import "@fontsource/ibm-plex-mono";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Appbar = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuthUser(null);
    navigate("/login");
  };
  return (
    <Box className="w-full py-2 border-b border-gray-500 relative">
      <h3 className="text-4xl" style={{ fontFamily: "IBM Plex Mono" }}>
        Chit-Chat
      </h3>
      {authUser ? (
        <Button
          href="/login"
          onClick={handleLogout}
          sx={{ position: "absolute", top: 8, right: 0 }}
        >
          Logout
        </Button>
      ) : null}
    </Box>
  );
};
export default Appbar;
