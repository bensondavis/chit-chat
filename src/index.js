import * as process from "process";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

window.global = window;
window.process = process;
window.Buffer = [];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <BrowserRouter>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
