import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { FileText, Plus, Search } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { addWorkflow } from "@/features/dashboard/dashboardSlice";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  clientId: z.string({ required_error: "Please select a client." }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority.",
  }),
  dueDate: z.string().min(1, { message: "Due date is required." }),
  assignedTo: z.array(z.string()).nonempty({ message: "Select at least one team member." }),
});

export default function AdminWorkflows() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { workflows, clients, teamMembers } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      clientId: "",
      priority: "medium",
      dueDate: "",
      assignedTo: [],
    },
  });

  const filteredWorkflows = workflows.filter(
    workflow => 
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Add workflow to the store
    dispatch(addWorkflow({
      title: data.title,
      clientId: data.clientId,
      priority: data.priority,
      dueDate: data.dueDate,
      assignedTo: selectedAssignees.length > 0 ? selectedAssignees : [],
    }));
    
    const clientName = clients.find(c => c.id === data.clientId)?.name || "";
    
    toast({
      title: "Workflow created",
      description: `${data.title} for ${clientName} has been created.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
    setSelectedAssignees([]);
  }

  const handleAssigneeChange = (teamMemberId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(teamMemberId)
        ? prev.filter(id => id !== teamMemberId)
        : [...prev, teamMemberId]
    );
    
    // Update form value
    const newAssignees = selectedAssignees.includes(teamMemberId)
      ? selectedAssignees.filter(id => id !== teamMemberId)
      : [...selectedAssignees, teamMemberId];
    
    form.setValue("assignedTo", newAssignees);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "qc":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "qa":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground">Manage your document workflows.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Workflow</DialogTitle>
                  <DialogDescription>
                    Enter the workflow details and assign team members.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter workflow title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={() => (
                        <FormItem>
                          <FormLabel>Assign Team Members</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {teamMembers.map((member) => (
                              <div 
                                key={member.id} 
                                className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                  selectedAssignees.includes(member.id) 
                                    ? "border-primary bg-primary/10" 
                                    : "border-muted"
                                }`}
                                onClick={() => handleAssigneeChange(member.id)}
                              >
                                <input 
                                  type="checkbox"
                                  checked={selectedAssignees.includes(member.id)}
                                  onChange={() => {}}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">{member.name} ({member.role})</span>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Create Workflow</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Workflows</CardTitle>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.title}</TableCell>
                    <TableCell>{workflow.clientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(workflow.status)}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityBadgeColor(workflow.priority)}>
                        {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(workflow.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.progress} className="h-2" />
                        <span className="text-xs">{workflow.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/workflows/${workflow.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredWorkflows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No workflows found.
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
