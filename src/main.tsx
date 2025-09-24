
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"
import App from "./App.tsx"
import { BrowserRouter } from "react-router-dom"
import "./index.css";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster
      position="top-center"
      toastOptions={{ duration: 3000 }}
    />
    </React.StrictMode>
);
