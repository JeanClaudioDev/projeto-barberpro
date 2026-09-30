import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Services from "./pages/services.jsx";
import Professionals from "./pages/professionals.jsx";
import Scheduling from "./pages/scheduling.jsx";
import Confirmation from "./pages/confirmation.jsx";
import Profile from "./pages/profile.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />

      <Route
        path="/professionals"
        element={
          <ProtectedRoute>
            <Professionals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scheduling"
        element={
          <ProtectedRoute>
            <Scheduling />
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirmation"
        element={
          <ProtectedRoute>
            <Confirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}