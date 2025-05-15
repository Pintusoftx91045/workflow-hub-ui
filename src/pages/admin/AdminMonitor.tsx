
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Sample data for charts
const workflowStatusData = [
  { name: "Draft", value: 4 },
  { name: "QC", value: 2 },
  { name: "QA", value: 3 },
  { name: "Completed", value: 7 },
  { name: "Rejected", value: 1 },
];

const teamPerformanceData = [
  { name: "John", tasks: 12, onTime: 10 },
  { name: "Jane", tasks: 9, onTime: 8 },
  { name: "Alex", tasks: 15, onTime: 14 },
  { name: "Sarah", tasks: 7, onTime: 6 },
  { name: "Mike", tasks: 11, onTime: 9 },
];

const documentTrendData = [
  { month: "Jan", documents: 22 },
  { month: "Feb", documents: 28 },
  { month: "Mar", documents: 35 },
  { month: "Apr", documents: 32 },
  { month: "May", documents: 40 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AdminMonitor() {
  const { clients, teamMembers, workflows } = useAppSelector((state) => state.dashboard);
  const [timeRange, setTimeRange] = useState("month");
  
  // Calculate metrics
  const activeWorkflows = workflows.filter(w => w.status !== "completed").length;
  const completedWorkflows = workflows.filter(w => w.status === "completed").length;
  const onTrackWorkflows = workflows.filter(w => {
    const dueDate = new Date(w.dueDate);
    const now = new Date();
    return w.status !== "completed" && dueDate > now;
  }).length;
  
  const delayedWorkflows = activeWorkflows - onTrackWorkflows;
  const delayedPercentage = activeWorkflows > 0 ? Math.round((delayedWorkflows / activeWorkflows) * 100) : 0;
  const completionRate = workflows.length > 0 ? Math.round((completedWorkflows / workflows.length) * 100) : 0;
  
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Monitoring Dashboard</h1>
            <p className="text-muted-foreground">Track workflow metrics and team performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <Select defaultValue="month" onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWorkflows}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeWorkflows} of {workflows.length} total workflows
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Delayed Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delayedWorkflows}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {delayedPercentage}% of active workflows are delayed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {new Set(teamMembers.map(m => m.department)).size} departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedWorkflows} of {workflows.length} workflows completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="workflows">Workflow Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Workflow Status</CardTitle>
                  <CardDescription>Distribution of workflows by current status</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={workflowStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {workflowStatusData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Document Trends</CardTitle>
                  <CardDescription>Number of documents processed over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={documentTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="documents" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clients Overview</CardTitle>
                <CardDescription>Summary of client activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                          {client.name.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="font-medium">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={client.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}>
                          {client.status}
                        </Badge>
                        <span className="text-sm">
                          {workflows.filter(w => w.clientId === client.id).length} workflows
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Member Performance</CardTitle>
                <CardDescription>Tasks completed vs. tasks assigned on time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
                      <Bar dataKey="onTime" fill="#82ca9d" name="On Time" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Member Assignments</CardTitle>
                <CardDescription>Current workload distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const assignedWorkflows = workflows.filter(w => 
                      w.assignedTo.includes(member.id) && w.status !== "completed"
                    );
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {member.name.substring(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <span className="font-medium">{member.name}</span>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={
                            assignedWorkflows.length > 3 
                              ? "bg-red-500/10 text-red-500" 
                              : assignedWorkflows.length > 1
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-green-500/10 text-green-500"
                          }>
                            {assignedWorkflows.length} active tasks
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Timeline</CardTitle>
                <CardDescription>Average time spent in each stage</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { stage: "Draft", days: 3 },
                        { stage: "QC", days: 2 },
                        { stage: "QA", days: 1 },
                        { stage: "Client Review", days: 4 },
                        { stage: "Revisions", days: 2 },
                      ]}
                      margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" />
                      <Tooltip />
                      <Bar dataKey="days" fill="#8884d8" name="Avg. Days" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>At-Risk Workflows</CardTitle>
                <CardDescription>Workflows that may miss their deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows
                    .filter(workflow => {
                      const dueDate = new Date(workflow.dueDate);
                      const now = new Date();
                      const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      return workflow.status !== "completed" && daysUntilDue < 5;
                    })
                    .map(workflow => (
                      <div key={workflow.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{workflow.title}</p>
                          <p className="text-xs text-muted-foreground">Client: {workflow.clientName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-red-500/10 text-red-500">
                            Due {new Date(workflow.dueDate).toLocaleDateString()}
                          </Badge>
                          <span className="text-xs">{workflow.progress}% complete</span>
                        </div>
                      </div>
                    ))}
                  
                  {!workflows.some(workflow => {
                    const dueDate = new Date(workflow.dueDate);
                    const now = new Date();
                    const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return workflow.status !== "completed" && daysUntilDue < 5;
                  }) && (
                    <div className="p-4 text-center text-muted-foreground">
                      No at-risk workflows at this time.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
