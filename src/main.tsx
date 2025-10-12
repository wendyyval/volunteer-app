import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./notifications/NotificationProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <NotificationProvider>
        <App />
        {/* Render Toaster INSIDE the React tree */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </NotificationProvider>
    </HashRouter>
  </React.StrictMode>
);