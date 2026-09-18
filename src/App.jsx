import { Routes, Route, Navigate} from "react-router-dom";

import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Services from "./pages/services.jsx";
import Professionals from "./pages/professionals.jsx";
import Scheduling from "./pages/scheduling.jsx";
// import Confirmation from "./pages/confirmation.jsx";
// import Profile from "./pages/profile.jsx";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>}/>

      <Route path="/login" element={<Login/>}/>

      <Route path="/home" element={<Home/>}/>

      <Route path="/services" element={<Services/>}/>

      <Route path="/professionals" element={<Professionals/>}/>

      <Route path="/scheduling" element={<Scheduling/>}/>
      
      {/* <Route path="/confirmation" element={<Confirmation/>}/>

      <Route path="/profile" element={<Profile/>}/> */}
    </Routes>
  );
}