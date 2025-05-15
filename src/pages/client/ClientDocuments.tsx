
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientSidebar from "@/components/sidebar/ClientSidebar";
import { Download, FileText, Search, Upload } from "lucide-react";

export default function ClientDocuments() {
  const navigate = useNavigate();
  const { documents, workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const handleDownload = (documentId: string) => {
    // In a real application, this would trigger a download
    // For now, we'll just show a console message
    console.log(`Downloading document ${documentId}`);
  };

  return (
    <DashboardLayout sidebar={<ClientSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Documents</h1>
            <p className="text-muted-foreground">
              View and manage all your documents.
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
          <CardHeader>
            <CardTitle>Document List</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
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
                  <TableHead>Document</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => {
                  const workflow = workflows.find(w => w.id === document.workflowId);
                  return (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{document.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{workflow?.title || "Unknown"}</TableCell>
                      <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(document.status)}>
                          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>v{document.version}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/client/documents/${document.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(document.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredDocuments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "No documents matching your search" : "No documents found"}
                        </p>
                        {!searchTerm && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate("/client/upload")}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
                          </Button>
                        )}
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
