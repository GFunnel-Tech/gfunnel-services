import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AllServices from "./pages/AllServices";
import ServicePage from "./pages/ServicePage";
import ActionHub from "./pages/ActionHub";
import DepartmentPage from "./pages/DepartmentPage";
import VisionIntake from "./pages/VisionIntake";
import VisionProcessing from "./pages/VisionProcessing";
import NotFound from "./pages/NotFound";

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
          <Route path="/:slug" element={<ServicePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
