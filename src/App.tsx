
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RoleDashboard from "./pages/RoleDashboard";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";

// Draft Team pages
import DraftTeamDashboard from "./pages/draft/DraftTeamDashboard";

// QC Team pages
import QCDashboard from "./pages/qc/QCDashboard";

// QA Team pages
import QADashboard from "./pages/qa/QADashboard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<RoleDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminDashboard />} />
              <Route path="/admin/team" element={<AdminDashboard />} />
              <Route path="/admin/workflows" element={<AdminDashboard />} />
              <Route path="/admin/templates" element={<AdminDashboard />} />
              <Route path="/admin/monitor" element={<AdminDashboard />} />
              
              {/* Client Routes */}
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/client/upload" element={<ClientDashboard />} />
              <Route path="/client/workflows" element={<ClientDashboard />} />
              <Route path="/client/documents" element={<ClientDashboard />} />
              
              {/* Draft Team Routes */}
              <Route path="/draft" element={<DraftTeamDashboard />} />
              <Route path="/draft/assigned" element={<DraftTeamDashboard />} />
              <Route path="/draft/upload" element={<DraftTeamDashboard />} />
              <Route path="/draft/notes" element={<DraftTeamDashboard />} />
              
              {/* QC Team Routes */}
              <Route path="/qc" element={<QCDashboard />} />
              <Route path="/qc/tasks" element={<QCDashboard />} />
              <Route path="/qc/approved" element={<QCDashboard />} />
              <Route path="/qc/rework" element={<QCDashboard />} />
              
              {/* QA Team Routes */}
              <Route path="/qa" element={<QADashboard />} />
              <Route path="/qa/review" element={<QADashboard />} />
              <Route path="/qa/approval" element={<QADashboard />} />
              <Route path="/qa/corrections" element={<QADashboard />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
