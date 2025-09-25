
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"
import App from "./App.tsx"
import { HashRouter } from "react-router-dom"
import "./index.css";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./notifications/NotificationProvider";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </HashRouter>
    <Toaster
      position="top-center"
      toastOptions={{ duration: 3000 }}
    />
    </React.StrictMode>
);
