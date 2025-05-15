
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  LayoutTemplate, 
  BarChart,
  UserPlus
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const sidebarItems = [
    { name: "Dashboard", icon: Home, path: "/admin" },
    { name: "Clients", icon: Users, path: "/admin/clients" },
    { name: "Team", icon: Users, path: "/admin/team" },
    { name: "Workflows", icon: FileText, path: "/admin/workflows" },
    { name: "Templates", icon: LayoutTemplate, path: "/admin/templates" },
    { name: "Monitor", icon: BarChart, path: "/admin/monitor" },
    { name: "Role", icon: UserPlus, path: "/admin/role" },
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
