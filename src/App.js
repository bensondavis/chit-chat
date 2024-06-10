import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

//pages
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
  }, []);
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<AuthPage />} />
          <Route exact path="/register" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
