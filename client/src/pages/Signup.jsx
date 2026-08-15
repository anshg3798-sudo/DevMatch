import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { signupUser } from "../services/authService";
const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });
   const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
    setError("Name is required.");
    return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
}

if (formData.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
}

if (
    formData.role !== "student" &&
    formData.role !== "recruiter"
) {
    setError("Please select a valid role.");
    return;
}
  setError("");
 setSuccess("");
    setLoading(true);
    setError("");

    try {
        const data = await signupUser(formData);

        console.log(data);

      setSuccess("Account created successfully!");

        setTimeout(() => {
    navigate("/login");
}, 1500);

    } catch (error) {

        setError(
            error.response?.data?.message ||
            "Signup Failed"
        );

    } finally {

        setLoading(false);

    }
};
    return (
        <AuthLayout>
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <h1 className="text-3xl font-bold text-white">
                    Create Account
                </h1>

                <p className="mt-2 text-zinc-400">
                    Start finding your perfect development team.
                </p>

                <form 
                 onSubmit={handleSubmit}
                className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@gmail.com"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Role
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
                        >
                            <option value="recruiter">
                                Recruiter
                            </option>

                            <option value="student">
                                Student
                            </option>
                        </select>
                    </div>
                    {
    error && (
        <p className="text-sm text-red-500">
            {error}
        </p>
    )
}
{error && (
    <p className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
        {error}
    </p>
)}

{success && (
    <p className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400">
        {success}
    </p>
)}
 <button
    type="submit"
    disabled={loading}
    className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
>
    {loading ? "Creating Account..." : "Create Account"}
</button>
                </form>

                <p className="mt-6 text-center text-zinc-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-400 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Signup;