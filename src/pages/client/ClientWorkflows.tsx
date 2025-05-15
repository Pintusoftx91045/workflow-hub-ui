
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/lib/store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientSidebar from "@/components/sidebar/ClientSidebar";
import WorkflowTable from "@/components/dashboard/WorkflowTable";
import { FileText, Search, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientWorkflows() {
  const navigate = useNavigate();
  const { workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  const activeWorkflows = workflows.filter(w => w.status !== 'completed');
  const completedWorkflows = workflows.filter(w => w.status === 'completed');
  
  const filteredActiveWorkflows = activeWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompletedWorkflows = completedWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout sidebar={<ClientSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Workflows</h1>
            <p className="text-muted-foreground">
              View and manage all your workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/client/upload")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Workflow List</CardTitle>
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
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                <TabsTrigger value="active">
                  Active 
                  <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500">
                    {activeWorkflows.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500">
                    {completedWorkflows.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                <WorkflowTable 
                  workflows={filteredActiveWorkflows}
                  onViewWorkflow={(id) => navigate(`/client/workflows/${id}`)}
                />
                
                {filteredActiveWorkflows.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No active workflows found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Try a different search term." : "Upload a document to start a new workflow."}
                    </p>
                    {!searchTerm && (
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => navigate("/client/upload")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <WorkflowTable 
                  workflows={filteredCompletedWorkflows}
                  onViewWorkflow={(id) => navigate(`/client/workflows/${id}`)}
                />
                
                {filteredCompletedWorkflows.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No completed workflows found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Try a different search term." : "Your completed workflows will appear here."}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
