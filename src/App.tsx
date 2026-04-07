import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ESGProvider } from "./context/ESGContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPages } from "./pages/AuthPages";
import { DashboardOverview } from "./pages/DashboardOverview";
import { LoanApplication } from "./pages/LoanApplication";
import { OffersPage } from "./pages/OffersPage";
import { ESGInsights } from "./pages/ESGInsights";
import { AuditLogs } from "./pages/AuditLogs";
import { Repayments } from "./pages/Repayments";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { WithdrawalsPage } from "./pages/WithdrawalsPage";
import { ComplianceVerification } from "./pages/ComplianceVerification";
import { LenderSMEReview } from "./pages/LenderSMEReview";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

function LenderGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role === 'LENDER') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ESGProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPages />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardOverview />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/apply" element={
                <ProtectedRoute>
                  <LenderGuard>
                    <DashboardLayout>
                      <LoanApplication />
                    </DashboardLayout>
                  </LenderGuard>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/offers" element={
                <ProtectedRoute>
                  <LenderGuard>
                    <DashboardLayout>
                      <OffersPage />
                    </DashboardLayout>
                  </LenderGuard>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/repayments" element={
                <ProtectedRoute>
                  <LenderGuard>
                    <DashboardLayout>
                      <Repayments />
                    </DashboardLayout>
                  </LenderGuard>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/portfolio" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PortfolioPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/marketplace" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MarketplacePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/withdrawals" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <WithdrawalsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/esg" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ESGInsights />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/audit" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AuditLogs />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/notifications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/verify" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ComplianceVerification />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/smes" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LenderSMEReview />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </ESGProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
