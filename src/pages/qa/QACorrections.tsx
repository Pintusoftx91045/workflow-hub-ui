
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
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
import { AlertCircle, FileText, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function QACorrections() {
  const navigate = useNavigate();
  const { workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter workflows in QA status that need corrections (progress < 90)
  const correctionsNeededWorkflows = workflows.filter(w => 
    w.status === 'qa' && w.progress < 90
  );
  
  const filteredWorkflows = correctionsNeededWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout sidebar={<QASidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Corrections Needed</h1>
          <p className="text-muted-foreground">
            Workflows that require corrections before final approval.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workflows Needing Corrections</CardTitle>
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
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Needs Corrections
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        onClick={() => navigate(`/qa/corrections/${workflow.id}`)}
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Add Feedback
                      </Button>
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
                            : "No workflows need corrections"}
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
