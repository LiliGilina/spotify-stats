import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Callback from "./Callback.jsx";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {path === "/callback" ? <Callback /> : <App />}
  </React.StrictMode>
);