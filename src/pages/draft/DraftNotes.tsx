
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DraftTeamSidebar from "@/components/sidebar/DraftTeamSidebar";
import { useAppSelector } from "@/lib/store";
import { CheckCircle, MessageSquare, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample notes data
const notesData = [
  {
    id: "1",
    workflowId: "1",
    workflowTitle: "Annual Report Revision",
    clientName: "Alpha Corp",
    content: "Client requested to emphasize Q4 performance in the executive summary.",
    createdAt: "2025-05-11T14:30:00Z",
  },
  {
    id: "2",
    workflowId: "2",
    workflowTitle: "Marketing Brochure",
    clientName: "Beta Industries",
    content: "Need to incorporate the new product features from the marketing team's brief.",
    createdAt: "2025-05-10T09:15:00Z",
  },
  {
    id: "3",
    workflowId: "3",
    workflowTitle: "Product Documentation",
    clientName: "Gamma Tech",
    content: "Technical team provided updated specifications for Section 4.",
    createdAt: "2025-05-08T16:45:00Z",
  },
];

export default function DraftNotes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState("");
  const { workflows } = useAppSelector((state) => state.dashboard);
  
  const filteredNotes = notesData.filter(note =>
    note.workflowTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (newNote.trim().length === 0) {
      toast({
        title: "Cannot add empty note",
        description: "Please enter some text for your note.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully.",
    });
    
    setNewNote("");
  };

  // Get active workflows for selection when creating a note
  const activeWorkflows = workflows.filter(w => w.status === "draft");

  return (
    <DashboardLayout sidebar={<DraftTeamSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notes & Comments</h1>
            <p className="text-muted-foreground">
              Keep track of important information for your workflows.
            </p>
          </div>
        </div>

        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="notes">My Notes</TabsTrigger>
            <TabsTrigger value="add">Add Note</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Notes</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search notes..." 
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
                      <TableHead>Note</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.workflowTitle}</TableCell>
                        <TableCell>{note.clientName}</TableCell>
                        <TableCell>
                          <div className="max-w-md truncate">
                            {note.content}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/draft/assigned/${note.workflowId}`)}
                          >
                            View Workflow
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredNotes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">
                              {searchTerm ? "No notes matching your search" : "No notes found"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Note</CardTitle>
                <CardDescription>
                  Create a new note for a workflow you're working on.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="workflow" className="block text-sm font-medium mb-1">
                      Select Workflow
                    </label>
                    <select 
                      id="workflow" 
                      className="w-full p-2 rounded-md border border-input"
                    >
                      {activeWorkflows.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                          {workflow.title} ({workflow.clientName})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium mb-1">
                      Note Content
                    </label>
                    <Textarea
                      id="note"
                      placeholder="Enter your note here..."
                      className="min-h-[150px]"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-3">
                <Button variant="outline" onClick={() => setNewNote("")}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
            <CardDescription>
              Recent comments from QC and QA teams on your documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {i === 0 ? "JS" : i === 1 ? "AJ" : "KL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {i === 0 ? "Jane Smith" : i === 1 ? "Alex Johnson" : "Kate Lee"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {i === 0 
                          ? "2 hours ago" 
                          : i === 1 
                            ? "Yesterday" 
                            : "3 days ago"}
                      </span>
                    </div>
                    <p className="text-sm">
                      {i === 0 
                        ? "Please correct the formatting in section 2.3, the table headers should be bold." 
                        : i === 1 
                          ? "The product specifications in paragraph 4 need to be updated with the latest information." 
                          : "Great work on the executive summary, approved with minor edits."}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {i === 0 
                          ? "Marketing Brochure" 
                          : i === 1 
                            ? "Product Documentation" 
                            : "Annual Report Revision"}
                      </span>
                      <span>•</span>
                      <Button variant="link" className="p-0 h-auto text-xs" asChild>
                        <a href="#">View Document</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All as Read
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
