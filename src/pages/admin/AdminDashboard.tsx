
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import { useAppSelector } from "@/lib/store";
import { Users, FileText, CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { clients, teamMembers, workflows } = useAppSelector((state) => state.dashboard);
  
  // Filter active workflows
  const activeWorkflows = workflows.filter(w => w.status !== 'completed' && w.status !== 'rejected');
  
  // Calculate metrics for the stats cards
  const totalClients = clients.length;
  const totalTeamMembers = teamMembers.length;
  const activeWorkflowsCount = activeWorkflows.length;
  const completedWorkflowsCount = workflows.filter(w => w.status === 'completed').length;

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/admin/clients/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/workflows/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Clients"
            value={totalClients}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Team Members"
            value={totalTeamMembers}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Workflows"
            value={activeWorkflowsCount}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatsCard
            title="Completed Workflows"
            value={completedWorkflowsCount}
            icon={<CheckCircle className="h-4 w-4" />}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeWorkflows.slice(0, 4).map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onViewDetails={(id) => navigate(`/admin/workflows/${id}`)}
              />
            ))}
            {activeWorkflows.length === 0 && (
              <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No active workflows</h3>
                <p className="text-muted-foreground mt-1">Create a new workflow to get started</p>
                <Button className="mt-4" onClick={() => navigate("/admin/workflows/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Workflow
                </Button>
              </div>
            )}
          </div>
          {activeWorkflows.length > 4 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => navigate("/admin/workflows")}>
                View All Workflows
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Clients</h2>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/40 p-4">
                <div className="grid grid-cols-3 text-sm font-medium">
                  <div>Client</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>
              </div>
              <div className="divide-y">
                {clients.slice(0, 3).map((client) => (
                  <div key={client.id} className="grid grid-cols-3 items-center p-4">
                    <div className="font-medium">{client.name}</div>
                    <div>
                      <span className={`inline-flex h-2 w-2 rounded-full ${
                        client.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      } mr-2`}></span>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/clients/${client.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {clients.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No clients found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/40 p-4">
                <div className="grid grid-cols-3 text-sm font-medium">
                  <div>Name</div>
                  <div>Role</div>
                  <div className="text-right">Action</div>
                </div>
              </div>
              <div className="divide-y">
                {teamMembers.slice(0, 3).map((member) => (
                  <div key={member.id} className="grid grid-cols-3 items-center p-4">
                    <div className="font-medium">{member.name}</div>
                    <div className="capitalize">{member.role}</div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/team/${member.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No team members found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
