import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { toast } from "sonner";

const Admin = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is an admin
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Check if user has admin role
    if (userRole !== 'admin') {
      toast.error("Access denied. Administrator privileges required.");
      navigate("/");
      return;
    }
    
    setLoading(false);
  }, [user, userRole, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Verifying access privileges...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Administrator Dashboard</h1>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
