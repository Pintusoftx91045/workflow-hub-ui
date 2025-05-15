
import { ReactNode, useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/store";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <div className={`fixed inset-y-0 z-30 transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
          <Sidebar className="h-full border-r">
            <SidebarHeader className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  WF
                </div>
                <span className="font-bold text-lg">WorkFlow</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleSidebar}
              >
                <span className="sr-only">Toggle sidebar</span>
                <span className="h-4 w-4">✕</span>
              </Button>
            </SidebarHeader>
            <SidebarContent className="flex flex-col justify-between h-[calc(100%-60px)]">
              <div className="p-4">
                {sidebar}
              </div>
              <div className="p-4 border-t mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
                {user && (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SidebarContent>
          </Sidebar>
        </div>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="bg-background border-b h-14 flex items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="h-6 w-6 flex flex-col justify-center space-y-1">
                <span className="h-0.5 w-full bg-foreground"></span>
                <span className="h-0.5 w-full bg-foreground"></span>
                <span className="h-0.5 w-full bg-foreground"></span>
              </span>
            </Button>
            <div className="ml-auto flex items-center space-x-2">
              {user && (
                <div className="md:hidden flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
