
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

export default function QCSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { name: "Dashboard", icon: FileText, path: "/qc" },
    { name: "QC Tasks", icon: FileText, path: "/qc/tasks" },
    { name: "Approved", icon: CheckCircle, path: "/qc/approved" },
    { name: "Rework Needed", icon: AlertTriangle, path: "/qc/rework" },
  ];
  
  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate(item.path)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Button>
      ))}
    </nav>
  );
}
