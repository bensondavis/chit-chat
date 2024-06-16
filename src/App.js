import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

//pages
import AuthPage from "./pages/AuthPage";
import Appbar from "./components/Appbar";
import ChatPage from "./pages/ChatPage";
import { useAuthContext } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { authUser } = useAuthContext();
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
  return (
    <div className="App min-h-screen max-w-screen">
      <Appbar />

      <Routes>
        <Route
          exact
          path="/login"
          element={authUser ? <Navigate to="/chat" /> : <AuthPage />}
        />
        <Route
          exact
          path="/register"
          element={authUser ? <Navigate to="/chat" /> : <AuthPage />}
        />
        <Route
          exact
          path="/chat/*"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
