import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx"; // App now just Outlet
import LandingLayout from "./layouts/LandingLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import EstimatePricePage from "./pages/EstimatePricePage.jsx";
import VesselsPage from "./pages/VesselsPage.jsx";
import SpeciesPage from "./pages/SpeciesPage.jsx";
import CatchPage from "./pages/CatchPage.jsx";
import AuctionsPage from "./pages/AuctionsPage.jsx";
import StoragePage from "./pages/StoragePage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import './styles/theme.css';
import './styles/logs.css';
import './styles/chat.css';
import './styles/reset.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Layout Routes */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            {/* Fallback for other marketing pages linked in header */}
            <Route path="/features" element={<LandingPage />} />
            <Route path="/solutions" element={<LandingPage />} />
            <Route path="/pricing" element={<LandingPage />} />
            <Route path="/docs" element={<LandingPage />} />
            <Route path="/contact" element={<LandingPage />} />
          </Route>

          {/* Dashboard Layout Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/vessels" element={<VesselsPage />} />
            <Route path="/dashboard/species" element={<SpeciesPage />} />
            <Route path="/dashboard/catch" element={<CatchPage />} />
            <Route path="/dashboard/auctions" element={<AuctionsPage />} />
            <Route path="/dashboard/storage" element={<StoragePage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/estimate" element={<EstimatePricePage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
