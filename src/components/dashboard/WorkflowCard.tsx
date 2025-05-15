
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from "lucide-react";
import { Workflow } from "@/features/dashboard/dashboardSlice";

interface WorkflowCardProps {
  workflow: Workflow;
  onViewDetails?: (id: string) => void;
}

export default function WorkflowCard({ workflow, onViewDetails }: WorkflowCardProps) {
  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'draft': return 'bg-blue-500';
      case 'qc': return 'bg-yellow-500';
      case 'qa': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority: Workflow['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{workflow.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{workflow.clientName}</p>
          </div>
          <div className="flex gap-2">
            {getPriorityBadge(workflow.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>Due {new Date(workflow.dueDate).toLocaleDateString()}</span>
          </div>
          <Badge className={`${getStatusColor(workflow.status)} text-white`}>
            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{workflow.progress}%</span>
          </div>
          <Progress value={workflow.progress} className="h-1" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="flex -space-x-2">
          {workflow.assignedTo.map((_, index) => (
            <Avatar key={index} className="border-2 border-background w-6 h-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U{index + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewDetails && onViewDetails(workflow.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
