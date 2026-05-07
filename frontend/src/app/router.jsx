import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import LogInteraction from "../pages/LogInteraction";
import InteractionHistory from "../pages/InteractionHistory";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "interactions/new", element: <LogInteraction /> },
      { path: "interactions", element: <InteractionHistory /> }
    ]
  }
]);
