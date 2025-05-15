
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  File 
} from "lucide-react";

export default function DraftTeamSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { name: "Dashboard", icon: FileText, path: "/draft" },
    { name: "Assigned Workflows", icon: FileText, path: "/draft/assigned" },
    { name: "Upload Converted", icon: Upload, path: "/draft/upload" },
    { name: "Notes", icon: File, path: "/draft/notes" },
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
