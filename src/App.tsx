
/*import './App.css'

function App() {

  return (
      <h1>testing front page</h1>
  )
}

export default App*/

import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/*to be created*/}
      <Route path="/profile" element={<Profile />} /> {/*to be created*/}
    </Routes>
  );
}