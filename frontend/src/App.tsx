import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VolunteerHistory from "./pages/VolunteerHistory";
import VolunteerAssign from "./pages/VolunteerAssignment";
import EventManage from "./pages/EventManage";
import Home from "./pages/Home";
import { isAdmin } from "./utils/role";
import AdminHome from "./pages/AdminHome";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={< Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<VolunteerHistory />} />

    {/*ADMIN ONLY ROUTES*/}
      <Route path="/admin" element={isAdmin() ? <AdminHome /> : <Navigate to="/" replace />} />
      <Route path="/assign" element={isAdmin() ? <VolunteerAssign /> : <Navigate to="/" replace />} />
      <Route path="/manage" element={isAdmin() ? < EventManage/> : <Navigate to="/" replace/>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}