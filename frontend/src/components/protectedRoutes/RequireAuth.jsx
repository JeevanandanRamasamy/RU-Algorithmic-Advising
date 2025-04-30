/**
 * RequireAuth Component
 *
 * This component acts as a route guard for protected student pages.
 * It checks if the user is authenticated (has a valid token) and has the "student" role.
 *
 * If the user is not authenticated as a student:
 *   - They are redirected to the login page ("/") using <Navigate />
 *   - The current location is stored in the state to optionally redirect them back after login
 *
 * If the user is authenticated:
 *   - The `children` (i.e., protected route components) are rendered
 *
 * Usage:
 * Wrap any route or component that should be accessible only to authenticated students.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RequireAuth = ({ children }) => {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token && role != "student") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
