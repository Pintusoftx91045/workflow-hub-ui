
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QASidebar from "@/components/sidebar/QASidebar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function QAApproval() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter workflows in QA status that are near completion (progress >= 90)
  const finalApprovalWorkflows = workflows.filter(w => 
    w.status === 'qa' && w.progress >= 90
  );
  
  const filteredWorkflows = finalApprovalWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApproval = (workflowId: string) => {
    toast({
      title: "Workflow approved",
      description: "The workflow has been approved and marked as completed.",
    });
    
    // In a real app, this would dispatch an action to update the workflow status
    navigate("/qa");
  };

  return (
    <DashboardLayout sidebar={<QASidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Final Approval</h1>
          <p className="text-muted-foreground">
            Workflows ready for final QA approval and completion.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ready for Final Approval</CardTitle>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{workflow.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{workflow.clientName}</TableCell>
                    <TableCell>{new Date(workflow.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.progress} className="h-2" />
                        <span className="text-xs">{workflow.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Ready for Approval
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/qa/approval/${workflow.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproval(workflow.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredWorkflows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          {searchTerm 
                            ? "No workflows matching your search" 
                            : "No workflows are ready for final approval"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
