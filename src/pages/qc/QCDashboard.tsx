
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QCSidebar from "@/components/sidebar/QCSidebar";
import { useAppSelector } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { Calendar, CheckCircle, AlertTriangle } from "lucide-react";

export default function QCDashboard() {
  const navigate = useNavigate();
  const { documents, workflows } = useAppSelector((state) => state.dashboard);
  
  // For a real app, we would filter documents that need QC review
  // Here for demo we'll just use all pending documents
  const pendingDocuments = documents.filter(d => d.status === 'pending');
  
  // Stats for dashboard
  const pendingReviews = pendingDocuments.length;
  const approvedDocuments = documents.filter(d => d.status === 'approved').length;
  const qcWorkflows = workflows.filter(w => w.status === 'qc').length;

  return (
    <DashboardLayout sidebar={<QCSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QC Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are the documents waiting for your review.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Pending Reviews"
            value={pendingReviews}
            icon={<Calendar className="h-4 w-4" />}
            className="bg-yellow-50 dark:bg-yellow-950/20"
          />
          <StatsCard
            title="Approved Documents"
            value={approvedDocuments}
            icon={<CheckCircle className="h-4 w-4" />}
            className="bg-green-50 dark:bg-green-950/20"
          />
          <StatsCard
            title="QC Workflows"
            value={qcWorkflows}
            icon={<AlertTriangle className="h-4 w-4" />}
            className="bg-blue-50 dark:bg-blue-950/20"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Submitted Drafts</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead className="hidden md:table-cell">Workflow</TableHead>
                    <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.map((document) => {
                    const workflow = workflows.find(w => w.id === document.workflowId);
                    return (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {workflow?.title || 'Unknown'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(document.uploadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/qc/tasks/${document.id}`)}
                            >
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {pendingDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No drafts waiting for review
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved</CardTitle>
              <CardDescription>Documents you've recently approved</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {documents.filter(d => d.status === 'approved').slice(0, 3).map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.title}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/qc/approved/${document.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {documents.filter(d => d.status === 'approved').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                        No approved documents
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rework Needed</CardTitle>
              <CardDescription>Documents that need revision</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {documents.filter(d => d.status === 'rejected').slice(0, 3).map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.title}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/qc/rework/${document.id}`)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {documents.filter(d => d.status === 'rejected').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                        No documents need rework
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
