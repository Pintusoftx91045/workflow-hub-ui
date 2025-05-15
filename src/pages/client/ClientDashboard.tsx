
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientSidebar from "@/components/sidebar/ClientSidebar";
import WorkflowTable from "@/components/dashboard/WorkflowTable";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import { useAppSelector } from "@/lib/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { workflows, documents } = useAppSelector((state) => state.dashboard);
  const user = useAppSelector((state) => state.auth.user);
  
  // For a real app, we would filter workflows by client ID
  // Here we'll just show all workflows for the demo
  const clientWorkflows = workflows;
  
  // Count documents by status
  const pendingDocuments = documents.filter(d => d.status === 'pending').length;
  const approvedDocuments = documents.filter(d => d.status === 'approved').length;
  
  return (
    <DashboardLayout sidebar={<ClientSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your workflows and documents.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
              <CardDescription>Overview of your document status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{pendingDocuments}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FileText className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{approvedDocuments}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => navigate('/client/documents')}>
                  View All Documents
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload a new document to start a workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                <Button onClick={() => navigate('/client/upload')}>Upload New Document</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Workflows</h2>
          <WorkflowTable 
            workflows={clientWorkflows}
            onViewWorkflow={(id) => navigate(`/client/workflows/${id}`)}
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => navigate('/client/workflows')}>
              View All Workflows
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
