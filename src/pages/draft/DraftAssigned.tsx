
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/lib/store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DraftTeamSidebar from "@/components/sidebar/DraftTeamSidebar";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Search } from "lucide-react";
import WorkflowCard from "@/components/dashboard/WorkflowCard";

export default function DraftAssigned() {
  const navigate = useNavigate();
  const { workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter workflows for draft team
  const draftWorkflows = workflows.filter(w => w.status === "draft");
  
  const filteredWorkflows = draftWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Prioritize workflows by due date
  const sortedWorkflows = [...filteredWorkflows].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  const upcomingDeadlines = sortedWorkflows.filter(w => {
    const dueDate = new Date(w.dueDate);
    const now = new Date();
    const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  });

  return (
    <DashboardLayout sidebar={<DraftTeamSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assigned Workflows</h1>
            <p className="text-muted-foreground">
              View and manage your assigned drafting tasks.
            </p>
          </div>
        </div>

        {upcomingDeadlines.length > 0 && (
          <Card className="border-amber-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-500 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                The following workflows are due within the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingDeadlines.slice(0, 3).map((workflow) => (
                  <Card key={workflow.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      new Date(workflow.dueDate) < new Date(Date.now() + 3*24*60*60*1000)
                        ? 'bg-red-500'
                        : 'bg-amber-500'
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
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Assigned Workflows</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workflows..." 
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onViewDetails={(id) => navigate(`/draft/assigned/${id}`)}
                />
              ))}
              
              {sortedWorkflows.length === 0 && (
                <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-medium">No assigned workflows</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchTerm 
                      ? "Try a different search term." 
                      : "You currently don't have any workflows assigned to you."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
