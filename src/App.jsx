import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import FindTalentPage from "./pages/FindTalentPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobDescriptionPage from "./pages/JobDescriptionPage";
import SubmitProposalPage from "./pages/SubmitProposalPage";
import ProposalSubmittedPage from "./pages/ProposalSubmittedPage";
import ClientProfilePage from "./pages/ClientProfilePage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";

import FreelancerDashboardPage from "./pages/FreelancerDashboardPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FreelancerProfileSetupPage from "./pages/FreelancerProfileSetupPage";
import ClientProfileSetupPage from "./pages/ClientProfileSetupPage";
import PostJobPage from "./pages/PostJobPage";
import ClientProposalsPage from "./pages/ClientProposalsPage";

function App() {
  return (
    <AuthProvider>
      <main className="app-shell">
        <Header />
        <div className="page-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse-jobs" element={<BrowseJobsPage />} />
            <Route path="/find-talent" element={<FindTalentPage />} />
            <Route path="/jobs/:jobId" element={<JobDescriptionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Freelancer Routes */}
            <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
              <Route
                path="/freelancer/setup-profile"
                element={<FreelancerProfileSetupPage />}
              />
              <Route
                path="/freelancer/dashboard"
                element={<FreelancerDashboardPage />}
              />
            </Route>

            {/* Client Routes */}
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route
                path="/client/setup-profile"
                element={<ClientProfileSetupPage />}
              />
              <Route
                path="/client/dashboard"
                element={<ClientDashboardPage />}
              />
              <Route
                path="/client/post-job"
                element={<PostJobPage />}
              />
              <Route
                path="/client/jobs/:jobId/proposals"
                element={<ClientProposalsPage />}
              />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboardPage />}
              />
            </Route>

            {/* General Protected Routes (any logged-in user) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/client-profile" element={<ClientProfilePage />} />
              <Route path="/freelancer-profile" element={<FreelancerProfilePage />} />
              <Route path="/jobs/:jobId/apply" element={<SubmitProposalPage />} />
              <Route
                path="/jobs/:jobId/proposal-submitted"
                element={<ProposalSubmittedPage />}
              />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </AuthProvider>
  );
}

export default App;
