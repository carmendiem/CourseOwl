import { Navigate } from "react-router-dom";

export function ProtectedRoute({ isLoggedIn, children }) {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
