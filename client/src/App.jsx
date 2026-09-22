import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateProject from "./pages/CreateProject";
import MyProjects from "./pages/MyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Profile from "./pages/Profile";
import Applicants from "./pages/Applicants";
import StudentProjects from "./pages/StudentProjects";
import StudentProjectDetails from "./pages/StudentProjectDetails";
import StudentApplications from "./pages/StudentApplications";
import StudentProfile from "./pages/StudentProfile";
import SearchDevelopers from "./pages/SearchDevelopers";
import DeveloperDetails from "./pages/DeveloperDetails";
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
        <ProtectedRoute  allowedRole="recruiter">
            <RecruiterDashboard  />
        </ProtectedRoute>
    }
/>
<Route
  path="/recruiter/search"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <SearchDevelopers />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/create-project"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <CreateProject />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/projects"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <MyProjects />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/projects/:id"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <ProjectDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/projects/:id/edit"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <EditProject />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/profile"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/applicants"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <Applicants />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/projects"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentProjects />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/projects/:id"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentProjectDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/applications"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/developers/:id"
  element={
    <ProtectedRoute allowedRole="recruiter">
      <DeveloperDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/profile"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentProfile />
    </ProtectedRoute>
  }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;