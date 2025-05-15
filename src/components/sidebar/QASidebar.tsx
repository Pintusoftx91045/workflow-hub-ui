
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

export default function QASidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { name: "Dashboard", icon: FileText, path: "/qa" },
    { name: "QA Review", icon: FileText, path: "/qa/review" },
    { name: "Final Approval", icon: CheckCircle, path: "/qa/approval" },
    { name: "Corrections", icon: AlertTriangle, path: "/qa/corrections" },
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
