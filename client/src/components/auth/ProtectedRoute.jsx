import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {

    const { loading, isAuthenticated, user } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {

        if (user?.role === "student") {
            return <Navigate to="/student/dashboard" replace />;
        }

        if (user?.role === "recruiter") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;