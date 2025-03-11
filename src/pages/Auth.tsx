
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-4">
        <div className="w-full max-w-md glass rounded-xl shadow-lg animate-fade-up">
          <div className="flex justify-center pt-6">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Tanzania Feedback Logo" 
                className="h-16 w-auto" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-primary/10 rounded-full">
                <span className="text-xl font-bold text-primary">TF</span>
              </div>
            )}
          </div>
          
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="p-6 pb-0">
              <h2 className="text-2xl font-bold text-center mb-6">
                {activeTab === "login" ? "Login to Your Account" : "Sign up"}
              </h2>
              
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="login" className="p-6 pt-4">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup" className="p-6 pt-4">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
