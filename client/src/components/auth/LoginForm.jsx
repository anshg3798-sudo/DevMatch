import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
   const handleSubmit = async (e) => {

    e.preventDefault();
    if (!formData.email.trim()) {
    setError("Email is required.");
    return;
}

if (!formData.password.trim()) {
    setError("Password is required.");
    return;
}

setError("");
    setLoading(true);
    setError("");
    try {

        const data = await loginUser(formData);
       login(data.user, data.token);

if (data.user.role === "recruiter") {
    navigate("/recruiter/dashboard");
} else {
    navigate("/student/dashboard");
}

    } catch (error) {
  setError(
    error.response?.data?.message ||
    "Login Failed"
);

    }
    finally{

setLoading(false);

}
};
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
           {error && (
    <p className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
        {error}
    </p>
)}
            <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                    Forgot Password?
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Signing In..." : "Sign In"}
            </button>

        </form>
    );
};

export default LoginForm;