import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserFeedbackHistory } from "@/components/profile/UserFeedbackHistory";
import { UserNotifications } from "@/components/profile/UserNotifications";
import { MessageSquare, User, Bell } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tanzania flag colors as decorative elements */}
      <div className="fixed top-0 left-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed top-0 right-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed bottom-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      <div className="fixed top-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 animate-fade-up">My Profile</h1>
          
          <div className="glass p-8 rounded-xl shadow-md">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile Information</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <UserNotifications />
              </TabsContent>
              
              <TabsContent value="profile">
                <ProfileForm />
              </TabsContent>
              
              <TabsContent value="history">
                <UserFeedbackHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
