import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
    path="/student/dashboard"
    element={
        <ProtectedRoute allowedRole="student">
            <StudentDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute>
            <RecruiterDashboard  allowedRole="recruiter"/>
        </ProtectedRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;