
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center max-w-3xl">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl md:text-4xl font-bold">
              WF
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-6">WorkFlow Manager</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A role-based dashboard for document workflow management
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mt-8 max-w-md mx-auto">
          <Button size="lg" className="h-14" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button size="lg" variant="outline" className="h-14" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="p-4">
            <div className="text-2xl font-semibold mb-2">5 User Roles</div>
            <p className="text-muted-foreground">Admin, Client, Draft Team, QC Team, and QA Team</p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-semibold mb-2">Document Management</div>
            <p className="text-muted-foreground">Upload, review, approve, and manage document workflows</p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-semibold mb-2">Modern UI</div>
            <p className="text-muted-foreground">Responsive design with dark mode support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
