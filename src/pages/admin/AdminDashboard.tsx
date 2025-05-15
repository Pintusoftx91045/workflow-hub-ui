
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { Users, FileText, CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { addClient, addWorkflow } from "@/features/dashboard/dashboardSlice";

const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

const workflowFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  clientId: z.string({ required_error: "Please select a client." }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority.",
  }),
  dueDate: z.string().min(1, { message: "Due date is required." }),
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { clients, teamMembers, workflows } = useAppSelector((state) => state.dashboard);
  
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  
  // Filter active workflows
  const activeWorkflows = workflows.filter(w => w.status !== 'completed' && w.status !== 'rejected');
  
  // Calculate metrics for the stats cards
  const totalClients = clients.length;
  const totalTeamMembers = teamMembers.length;
  const activeWorkflowsCount = activeWorkflows.length;
  const completedWorkflowsCount = workflows.filter(w => w.status === 'completed').length;

  const clientForm = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
    },
  });

  const workflowForm = useForm<z.infer<typeof workflowFormSchema>>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      title: "",
      clientId: "",
      priority: "medium",
      dueDate: "",
    },
  });

  function onSubmitClient(data: z.infer<typeof clientFormSchema>) {
    dispatch(addClient({
      name: data.name,
      company: data.company,
      email: data.email,
      status: 'active'
    }));
    
    toast({
      title: "Client added",
      description: `${data.name} from ${data.company} has been added.`,
    });
    
    setIsClientDialogOpen(false);
    clientForm.reset();
  }

  function onSubmitWorkflow(data: z.infer<typeof workflowFormSchema>) {
    dispatch(addWorkflow({
      title: data.title,
      clientId: data.clientId,
      priority: data.priority,
      dueDate: data.dueDate,
      assignedTo: selectedAssignees.length > 0 ? selectedAssignees : [teamMembers[0]?.id || "1"],
    }));
    
    const clientName = clients.find(c => c.id === data.clientId)?.name || "";
    
    toast({
      title: "Workflow created",
      description: `${data.title} for ${clientName} has been created.`,
    });
    
    setIsWorkflowDialogOpen(false);
    workflowForm.reset();
    setSelectedAssignees([]);
  }

  const handleAssigneeChange = (teamMemberId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(teamMemberId)
        ? prev.filter(id => id !== teamMemberId)
        : [...prev, teamMemberId]
    );
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new client. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...clientForm}>
                  <form onSubmit={clientForm.handleSubmit(onSubmitClient)} className="space-y-4">
                    <FormField
                      control={clientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clientForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Save Client</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
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
                <Form {...workflowForm}>
                  <form onSubmit={workflowForm.handleSubmit(onSubmitWorkflow)} className="space-y-4">
                    <FormField
                      control={workflowForm.control}
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
                      control={workflowForm.control}
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
                        control={workflowForm.control}
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
                        control={workflowForm.control}
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
                    </FormItem>
                    <DialogFooter>
                      <Button type="submit">Create Workflow</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Clients"
            value={totalClients}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Team Members"
            value={totalTeamMembers}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Workflows"
            value={activeWorkflowsCount}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatsCard
            title="Completed Workflows"
            value={completedWorkflowsCount}
            icon={<CheckCircle className="h-4 w-4" />}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeWorkflows.slice(0, 4).map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onViewDetails={(id) => navigate(`/admin/workflows/${id}`)}
              />
            ))}
            {activeWorkflows.length === 0 && (
              <div className="col-span-full bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No active workflows</h3>
                <p className="text-muted-foreground mt-1">Create a new workflow to get started</p>
                <Button className="mt-4" onClick={() => setIsWorkflowDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Workflow
                </Button>
              </div>
            )}
          </div>
          {activeWorkflows.length > 4 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => navigate("/admin/workflows")}>
                View All Workflows
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Clients</h2>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/40 p-4">
                <div className="grid grid-cols-3 text-sm font-medium">
                  <div>Client</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>
              </div>
              <div className="divide-y">
                {clients.slice(0, 3).map((client) => (
                  <div key={client.id} className="grid grid-cols-3 items-center p-4">
                    <div className="font-medium">{client.name}</div>
                    <div>
                      <span className={`inline-flex h-2 w-2 rounded-full ${
                        client.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      } mr-2`}></span>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/clients/${client.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {clients.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No clients found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/40 p-4">
                <div className="grid grid-cols-3 text-sm font-medium">
                  <div>Name</div>
                  <div>Role</div>
                  <div className="text-right">Action</div>
                </div>
              </div>
              <div className="divide-y">
                {teamMembers.slice(0, 3).map((member) => (
                  <div key={member.id} className="grid grid-cols-3 items-center p-4">
                    <div className="font-medium">{member.name}</div>
                    <div className="capitalize">{member.role}</div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/team/${member.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No team members found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
