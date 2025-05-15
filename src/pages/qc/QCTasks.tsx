
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
import { FileText, Search } from "lucide-react";

export default function QCTasks() {
  const navigate = useNavigate();
  const { documents, workflows } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  
  // For demo, filter documents that need QC review - pending documents
  const pendingDocuments = documents.filter(d => d.status === "pending");
  
  const filteredDocuments = pendingDocuments.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout sidebar={<QCSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quality Control Tasks</h1>
          <p className="text-muted-foreground">
            Review and manage documents that require quality control.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending QC Reviews</CardTitle>
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
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Priority</TableHead>
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
                          className={
                            workflow?.priority === "high"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : workflow?.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-green-500/10 text-green-500 border-green-500/20"
                          }
                        >
                          {workflow?.priority?.charAt(0).toUpperCase() + workflow?.priority?.slice(1) || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => navigate(`/qc/tasks/${document.id}`)}
                        >
                          Review
                        </Button>
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
                          {searchTerm ? "No documents matching your search" : "No pending documents for review"}
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
