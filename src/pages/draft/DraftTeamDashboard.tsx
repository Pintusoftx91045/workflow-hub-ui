
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DraftTeamSidebar from "@/components/sidebar/DraftTeamSidebar";
import { useAppSelector } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default function DraftTeamDashboard() {
  const navigate = useNavigate();
  const { workflows } = useAppSelector((state) => state.dashboard);
  const user = useAppSelector((state) => state.auth.user);
  
  // For a real app, we would filter workflows assigned to this draft team member
  // Here we'll just filter by status for the demo
  const assignedWorkflows = workflows.filter(w => w.status === 'draft');
  
  // Sort by due date to highlight upcoming deadlines
  const sortedWorkflows = [...assignedWorkflows].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  return (
    <DashboardLayout sidebar={<DraftTeamSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Draft Team Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your assigned workflows and tasks.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedWorkflows.slice(0, 3).map((workflow) => (
              <Card key={workflow.id} className="overflow-hidden">
                <div className={`h-1 ${
                  new Date(workflow.dueDate) < new Date(Date.now() + 3*24*60*60*1000)
                    ? 'bg-red-500'
                    : new Date(workflow.dueDate) < new Date(Date.now() + 7*24*60*60*1000)
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{workflow.title}</CardTitle>
                    <Badge className="bg-blue-500">Draft</Badge>
                  </div>
                  <CardDescription>{workflow.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Due: {new Date(workflow.dueDate).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/draft/assigned/${workflow.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {assignedWorkflows.length === 0 && (
              <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No assigned workflows</h3>
                <p className="text-muted-foreground mt-1">
                  You currently don't have any workflows assigned to you.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Assigned Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignedWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onViewDetails={(id) => navigate(`/draft/assigned/${id}`)}
              />
            ))}
            
            {assignedWorkflows.length === 0 && (
              <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No assigned workflows</h3>
                <p className="text-muted-foreground mt-1">
                  You currently don't have any workflows assigned to you.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Converted Document</CardTitle>
              <CardDescription>Upload your converted documents for review</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/draft/upload')}>
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
