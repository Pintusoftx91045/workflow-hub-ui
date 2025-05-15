
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QASidebar from "@/components/sidebar/QASidebar";
import { Calendar, FileText, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function QAReview() {
  const navigate = useNavigate();
  const { workflows, documents } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter workflows in QA status
  const qaWorkflows = workflows.filter(w => w.status === 'qa');
  
  const filteredWorkflows = qaWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout sidebar={<QASidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QA Review</h1>
          <p className="text-muted-foreground">
            Workflows waiting for final quality assurance.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quality Assurance Queue</CardTitle>
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
              {filteredWorkflows.map((workflow) => {
                // Find the latest document for this workflow
                const latestDocument = documents
                  .filter(d => d.workflowId === workflow.id)
                  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
                  
                return (
                  <Card key={workflow.id}>
                    <CardHeader>
                      <CardTitle>{workflow.title}</CardTitle>
                      <CardDescription>{workflow.clientName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due {new Date(workflow.dueDate).toLocaleDateString()}</span>
                        </div>
                        <Badge className="bg-purple-500">QA</Badge>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Latest Document</h4>
                        {latestDocument ? (
                          <div className="text-sm p-2 bg-muted/40 rounded">
                            <p className="font-medium">{latestDocument.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {new Date(latestDocument.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No documents uploaded</p>
                        )}
                      </div>
                      <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {workflow.assignedTo.map((_, index) => (
                            <Avatar key={index} className="border-2 border-background w-6 h-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>U{index + 1}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Button onClick={() => navigate(`/qa/review/${workflow.id}`)}>
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredWorkflows.length === 0 && (
                <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-medium">No workflows pending QA</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchTerm 
                      ? "Try a different search term." 
                      : "All workflows have been reviewed or are in earlier stages."}
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
