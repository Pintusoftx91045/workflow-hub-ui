
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/features/dashboard/dashboardSlice";
import { Progress } from "@/components/ui/progress";

interface WorkflowTableProps {
  workflows: Workflow[];
  onViewWorkflow?: (id: string) => void;
}

export default function WorkflowTable({ workflows, onViewWorkflow }: WorkflowTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Workflow | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Workflow) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedWorkflows = [...workflows].sort((a, b) => {
    if (!sortColumn) return 0;
    
    if (sortOrder === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const getStatusBadge = (status: Workflow['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Draft</Badge>;
      case 'qc':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">QC</Badge>;
      case 'qa':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">QA</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {sortColumn === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('status')}
              >
                Status {sortColumn === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('dueDate')}
              >
                Due Date {sortColumn === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="hidden lg:table-cell">Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWorkflows.length > 0 ? (
              sortedWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{workflow.clientName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(workflow.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(workflow.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.progress} className="h-2 flex-1" />
                      <span className="text-xs w-8 text-right">{workflow.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onViewWorkflow && onViewWorkflow(workflow.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No workflows found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
