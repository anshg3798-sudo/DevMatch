import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-10 text-white">
            <h1 className="text-4xl font-bold">
                Recruiter Dashboard
            </h1>

            <p className="mt-4">
                Welcome {user?.name}
            </p>

            <button
                onClick={handleLogout}
                className="mt-8 rounded-lg bg-red-600 px-5 py-3 hover:bg-red-500"
            >
                Logout
            </button>
        </div>
    );
};

export default RecruiterDashboard;