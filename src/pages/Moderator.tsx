
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { ModeratorDashboard } from "@/components/moderator/ModeratorDashboard";
import { toast } from "sonner";

const Moderator = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Check if user is a moderator or admin
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Check if user has moderator or admin role
    if (userRole !== 'moderator' && userRole !== 'admin') {
      toast.error("Access denied. Moderator privileges required.");
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
          <h1 className="text-3xl font-bold mb-8">Moderator Dashboard</h1>
          <ModeratorDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Moderator;
