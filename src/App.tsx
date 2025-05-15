
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
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from "./pages/admin/AdminClients";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminWorkflows from "./pages/admin/AdminWorkflows";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminMonitor from "./pages/admin/AdminMonitor";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientUpload from "./pages/client/ClientUpload";
import ClientWorkflows from "./pages/client/ClientWorkflows";
import ClientDocuments from "./pages/client/ClientDocuments";

// Draft Team pages
import DraftTeamDashboard from "./pages/draft/DraftTeamDashboard";
import DraftAssigned from "./pages/draft/DraftAssigned";
import DraftUpload from "./pages/draft/DraftUpload";
import DraftNotes from "./pages/draft/DraftNotes";

// QC Team pages
import QCDashboard from "./pages/qc/QCDashboard";
import QCTasks from "./pages/qc/QCTasks";
import QCApproved from "./pages/qc/QCApproved";
import QCRework from "./pages/qc/QCRework";

// QA Team pages
import QADashboard from "./pages/qa/QADashboard";
import QAReview from "./pages/qa/QAReview";
import QAApproval from "./pages/qa/QAApproval";
import QACorrections from "./pages/qa/QACorrections";

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
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/clients/:id" element={<AdminClients />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route path="/admin/team/:id" element={<AdminTeam />} />
              <Route path="/admin/workflows" element={<AdminWorkflows />} />
              <Route path="/admin/workflows/:id" element={<AdminWorkflows />} />
              <Route path="/admin/templates" element={<AdminTemplates />} />
              <Route path="/admin/templates/:id" element={<AdminTemplates />} />
              <Route path="/admin/monitor" element={<AdminMonitor />} />
              <Route path="/admin/settings" element={<ProfilePage />} />
              
              {/* Client Routes */}
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/client/upload" element={<ClientUpload />} />
              <Route path="/client/workflows" element={<ClientWorkflows />} />
              <Route path="/client/workflows/:id" element={<ClientWorkflows />} />
              <Route path="/client/documents" element={<ClientDocuments />} />
              <Route path="/client/documents/:id" element={<ClientDocuments />} />
              <Route path="/client/settings" element={<ProfilePage />} />
              
              {/* Draft Team Routes */}
              <Route path="/draft" element={<DraftTeamDashboard />} />
              <Route path="/draft/assigned" element={<DraftAssigned />} />
              <Route path="/draft/assigned/:id" element={<DraftAssigned />} />
              <Route path="/draft/upload" element={<DraftUpload />} />
              <Route path="/draft/notes" element={<DraftNotes />} />
              <Route path="/draft/settings" element={<ProfilePage />} />
              
              {/* QC Team Routes */}
              <Route path="/qc" element={<QCDashboard />} />
              <Route path="/qc/tasks" element={<QCTasks />} />
              <Route path="/qc/tasks/:id" element={<QCTasks />} />
              <Route path="/qc/approved" element={<QCApproved />} />
              <Route path="/qc/approved/:id" element={<QCApproved />} />
              <Route path="/qc/rework" element={<QCRework />} />
              <Route path="/qc/rework/:id" element={<QCRework />} />
              <Route path="/qc/settings" element={<ProfilePage />} />
              
              {/* QA Team Routes */}
              <Route path="/qa" element={<QADashboard />} />
              <Route path="/qa/review" element={<QAReview />} />
              <Route path="/qa/review/:id" element={<QAReview />} />
              <Route path="/qa/approval" element={<QAApproval />} />
              <Route path="/qa/approval/:id" element={<QAApproval />} />
              <Route path="/qa/corrections" element={<QACorrections />} />
              <Route path="/qa/corrections/:id" element={<QACorrections />} />
              <Route path="/qa/settings" element={<ProfilePage />} />
              
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
