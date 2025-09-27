import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VolunteerHistory from "./pages/VolunteerHistory";
import VolunteerAssign from "./pages/VolunteerAssignment";
import EventManage from "./pages/EventManage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<VolunteerHistory />} />
      <Route path="/assign" element={<VolunteerAssign />} />
      <Route path="/manage" element={< EventManage/>} />
    </Routes>
  );
}