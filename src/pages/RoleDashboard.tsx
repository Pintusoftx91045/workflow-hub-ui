
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/lib/store";
import { useEffect } from "react";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
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
          navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // This is just a placeholder while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
