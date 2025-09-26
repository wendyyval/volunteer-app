import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
// import AdminEvents from "./pages/AdminEvents";
import VolunteerHistory from "./pages/VolunteerHistory";
import EventManage from "./pages/EventManage"; // <-- import your EventManage page

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/profile" element={<Profile />} /> 
      {/* <Route path="/events/admin" element={<AdminEvents />} /> */}
      <Route path="/events/manage" element={<EventManage />} /> {/* <-- add route */}
      <Route path="/history" element={<VolunteerHistory />}/>
      <Route path="*" element={<Navigate to="/history" replace />} />
    </Routes>
  );
}