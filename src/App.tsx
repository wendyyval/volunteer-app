import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VolunteerHistory from "./pages/VolunteerHistory";
import VolunteerList from "./VolunteerList";
import EventList from "./EventList";

export default function App() {
  return (
    <>
      <div className="auth-shell">
        <h1 className="dashboard-title">Volunteer Assignment Page</h1>
        <VolunteerList />
        <EventList />
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<VolunteerHistory />} />
        <Route path="*" element={<Navigate to="/history" replace />} />
      </Routes>
    </>
  );
}
