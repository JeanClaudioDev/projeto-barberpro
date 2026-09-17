import { Routes, Route} from "react-router-dom";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Home/>}/>
    </Routes>
  )
}