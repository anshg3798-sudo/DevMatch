import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {

    const { loading, isAuthenticated, user } = useAuth();
    const { pathname } = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ requested: pathname }} replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        if (pathname === "/recruiter/search" || pathname === "/student/projects") {
            const isTalentSearch = pathname === "/recruiter/search";
            const requiredAccount = isTalentSearch ? "recruiter" : "student";
            return (
                <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-white">
                    <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                        <h1 className="text-2xl font-semibold">{isTalentSearch ? "Discover Talent" : "Explore Projects"}</h1>
                        <p className="mt-3 text-zinc-300">This page requires a {requiredAccount} account. You’re currently signed in as {user?.name || "another account"}.</p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Link to="/login" state={{ requested: pathname }} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500">
                                Sign in as a {requiredAccount}
                            </Link>
                            <Link to={isTalentSearch ? "/student/dashboard" : "/recruiter/dashboard"} className="text-sm text-indigo-300 hover:underline">
                                Back to dashboard
                            </Link>
                        </div>
                    </section>
                </main>
            );
        }

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
