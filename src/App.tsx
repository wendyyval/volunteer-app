import { Routes, Route, Navigate } from "react-router-dom";
import VolunteerList from "./VolunteerList";
import EventList from "./EventList";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VolunteerHistory from "./pages/VolunteerHistory";
import EventManage from "./pages/EventManage"; 
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/events/manage" element={<EventManage />} />
      <Route path="/history" element={<VolunteerHistory />}/>
      <Route path="*" element={<Navigate to="/history" replace />} />
    </Routes>
    <>
      <div className="auth-shell">
        <h1 className="dashboard-title">Volunteer Assignment Page</h1>
        <VolunteerList />
        <EventList />
      </div>