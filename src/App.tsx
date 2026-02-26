import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AllServices from "./pages/AllServices";
import ServicePage from "./pages/ServicePage";
import ServiceIntakePage from "./pages/ServiceIntakePage";
import ActionHub from "./pages/ActionHub";
import DepartmentPage from "./pages/DepartmentPage";
import VisionIntake from "./pages/VisionIntake";
import VisionProcessing from "./pages/VisionProcessing";
import ServiceConfirmation from "./pages/ServiceConfirmation";
import Resources from "./pages/Resources";
import UsageWalletPage from "./pages/UsageWalletPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompaniesPage from "./pages/admin/CompaniesPage";
import CompanyFormPage from "./pages/admin/CompanyFormPage";
import CompanyUsersPage from "./pages/admin/CompanyUsersPage";
import AccessItemsPage from "./pages/admin/AccessItemsPage";
import ProjectRequestsPage from "./pages/admin/ProjectRequestsPage";
import ImmersionPortal from "./pages/ImmersionPortal";
import ImmersionManagementPage from "./pages/admin/ImmersionManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<AllServices />} />
          <Route path="/service-hub" element={<ActionHub />} />
          <Route path="/service-hub/:departmentSlug" element={<DepartmentPage />} />
          <Route path="/vision-intake" element={<VisionIntake />} />
          <Route path="/vision-processing" element={<VisionProcessing />} />
          <Route path="/service-confirmation" element={<ServiceConfirmation />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/wallet" element={<UsageWalletPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/companies" element={<CompaniesPage />} />
          <Route path="/admin/companies/new" element={<CompanyFormPage />} />
          <Route path="/admin/companies/:id" element={<CompanyFormPage />} />
          <Route path="/admin/companies/:id/users" element={<CompanyUsersPage />} />
          <Route path="/admin/companies/:id/access" element={<AccessItemsPage />} />
          <Route path="/admin/requests" element={<ProjectRequestsPage />} />
          <Route path="/admin/immersion" element={<ImmersionManagementPage />} />
          <Route path="/immersion/:id" element={<ImmersionPortal />} />
          <Route path="/profile/:roleId" element={<ProfilePage />} />
          <Route path="/get-started/:slug" element={<ServiceIntakePage />} />
          <Route path="/:slug" element={<ServicePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
