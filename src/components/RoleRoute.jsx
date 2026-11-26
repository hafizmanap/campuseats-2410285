import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { Loading } from "./Status.jsx";

// UI only: the real protection is firestore.rules.
function RoleRoute({ roles }) {
    const { user, role, loading } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;
    
    // TODO 1: if roles does NOT include role, return <p>This page is for {roles.join(' or ')} accounts.</p>
    // Hint: roles.includes(role)
    if (!roles.includes(role)) {
        return <p>This page is for {roles.join(" or ")} accounts.</p>;
    }
    return <Outlet />;
}

export default RoleRoute;
