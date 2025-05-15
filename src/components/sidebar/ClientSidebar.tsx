
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  File
} from "lucide-react";

export default function ClientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { name: "Dashboard", icon: FileText, path: "/client" },
    { name: "Upload Document", icon: Upload, path: "/client/upload" },
    { name: "My Workflows", icon: FileText, path: "/client/workflows" },
    { name: "Final Documents", icon: File, path: "/client/documents" },
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
