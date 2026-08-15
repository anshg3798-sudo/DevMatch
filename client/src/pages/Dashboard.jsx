import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10">

            <h1 className="text-4xl font-bold">
                Welcome {user?.name}
            </h1>

            <p className="mt-3 text-zinc-400">
                Email : {user?.email}
            </p>

            <p className="mt-2">
                Role :
                <span className="ml-2 rounded bg-indigo-600 px-3 py-1">
                    {user?.role}
                </span>
            </p>

            <button
                onClick={handleLogout}
                className="mt-8 rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-500"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;