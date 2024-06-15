import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

//pages
import AuthPage from "./pages/AuthPage";
import Appbar from "./components/Appbar";
import ChatPage from "./pages/ChatPage";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();
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
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
