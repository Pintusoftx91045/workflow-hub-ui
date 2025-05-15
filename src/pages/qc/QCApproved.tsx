
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QCSidebar from "@/components/sidebar/QCSidebar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Search } from "lucide-react";

export default function QCApproved() {
  const navigate = useNavigate();
  const { documents, workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter approved documents
  const approvedDocuments = documents.filter(d => d.status === "approved");
  
  const filteredDocuments = approvedDocuments.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (documentId: string) => {
    // In a real application, this would trigger a download
    console.log(`Downloading document ${documentId}`);
  };

  return (
    <DashboardLayout sidebar={<QCSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approved Documents</h1>
          <p className="text-muted-foreground">
            Documents that have passed QC review.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QC Approved Documents</CardTitle>
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
                  <TableHead>Client</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Status</TableHead>
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
                      <TableCell>{workflow?.clientName || "Unknown"}</TableCell>
                      <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          QC Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/qc/approved/${document.id}`)}
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
                          {searchTerm ? "No documents matching your search" : "No approved documents found"}
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
