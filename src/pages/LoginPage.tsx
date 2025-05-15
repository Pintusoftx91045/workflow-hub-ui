
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/store";
import { setUserRole } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@/features/auth/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real app, we would make an API call here
    // For the demo, we'll just set the role
    dispatch(setUserRole(role));
    
    // Navigate to the appropriate dashboard based on role
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "client":
        navigate("/client");
        break;
      case "draft":
        navigate("/draft");
        break;
      case "qc":
        navigate("/qc");
        break;
      case "qa":
        navigate("/qa");
        break;
      default:
        navigate("/");
    }
    
    toast.success("Successfully logged in!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">WorkFlow Manager</h1>
          <p className="text-muted-foreground mt-2">Log in to access your dashboard</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Role selector for demo purposes */}
              <div className="space-y-2">
                <Label htmlFor="role">Role (Demo)</Label>
                <Select defaultValue={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="draft">Draft Team</SelectItem>
                    <SelectItem value="qc">QC Team</SelectItem>
                    <SelectItem value="qa">QA Team</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This is for demo purposes only. Select a role to view different dashboards.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Log In</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
