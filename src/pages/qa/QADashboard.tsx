
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QASidebar from "@/components/sidebar/QASidebar";
import { useAppSelector } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText } from "lucide-react";

export default function QADashboard() {
  const navigate = useNavigate();
  const { workflows, documents } = useAppSelector((state) => state.dashboard);
  
  // For a real app, we would filter documents that need QA review
  // Here for demo we'll filter workflows in QA status
  const qaWorkflows = workflows.filter(w => w.status === 'qa');
  
  // Stats for dashboard
  const pendingQA = qaWorkflows.length;
  const finalApproved = workflows.filter(w => w.status === 'completed').length;
  const documentsCount = documents.length;

  return (
    <DashboardLayout sidebar={<QASidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QA Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are the workflows waiting for final quality assurance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Pending QA"
            value={pendingQA}
            icon={<Clock className="h-4 w-4" />}
            className="bg-orange-50 dark:bg-orange-950/20"
          />
          <StatsCard
            title="Final Approved"
            value={finalApproved}
            icon={<CheckCircle className="h-4 w-4" />}
            className="bg-green-50 dark:bg-green-950/20"
          />
          <StatsCard
            title="Total Documents"
            value={documentsCount}
            icon={<FileText className="h-4 w-4" />}
            className="bg-blue-50 dark:bg-blue-950/20"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Pending QA Review</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {qaWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <CardTitle>{workflow.title}</CardTitle>
                  <CardDescription>{workflow.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due {new Date(workflow.dueDate).toLocaleDateString()}</span>
                    </div>
                    <Badge className="bg-orange-500">QA</Badge>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Latest Document</h4>
                    {documents
                      .filter(d => d.workflowId === workflow.id)
                      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                      .slice(0, 1)
                      .map(document => (
                        <div key={document.id} className="text-sm p-2 bg-muted/40 rounded">
                          <p className="font-medium">{document.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    }
                    {!documents.some(d => d.workflowId === workflow.id) && (
                      <p className="text-sm text-muted-foreground">No documents uploaded</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
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
                </CardFooter>
              </Card>
            ))}
            
            {qaWorkflows.length === 0 && (
              <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No workflows pending QA</h3>
                <p className="text-muted-foreground mt-1">
                  All workflows have been reviewed or are in earlier stages.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Final Approval</CardTitle>
              <CardDescription>Workflows ready for final approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows
                  .filter(w => w.status === 'qa' && w.progress >= 90)
                  .slice(0, 3)
                  .map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                      <div>
                        <p className="font-medium">{workflow.title}</p>
                        <p className="text-xs text-muted-foreground">{workflow.clientName}</p>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/qa/approval/${workflow.id}`)}>
                        Approve
                      </Button>
                    </div>
                  ))
                }
                
                {workflows.filter(w => w.status === 'qa' && w.progress >= 90).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No workflows ready for final approval
                  </div>
                )}
              </div>
            </CardContent>
            {workflows.filter(w => w.status === 'qa' && w.progress >= 90).length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/qa/approval')}>
                  View All
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Corrections Needed</CardTitle>
              <CardDescription>Workflows that need corrections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows
                  .filter(w => w.status === 'qa' && w.progress < 90)
                  .slice(0, 3)
                  .map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                      <div>
                        <p className="font-medium">{workflow.title}</p>
                        <p className="text-xs text-muted-foreground">{workflow.clientName}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/qa/corrections/${workflow.id}`)}>
                        Details
                      </Button>
                    </div>
                  ))
                }
                
                {workflows.filter(w => w.status === 'qa' && w.progress < 90).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No workflows need corrections
                  </div>
                )}
              </div>
            </CardContent>
            {workflows.filter(w => w.status === 'qa' && w.progress < 90).length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/qa/corrections')}>
                  View All
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
