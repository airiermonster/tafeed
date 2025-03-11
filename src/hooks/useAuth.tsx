import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserRole } from "@/types/feedback";

interface UserProfile {
  id: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  region?: string;
  date_of_birth?: string;
}

interface LanguageContextType {
  language: "en" | "sw";
  setLanguage: (lang: "en" | "sw") => void;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  profile: UserProfile | null;
  userRole: UserRole | null;
  fetchUserRole: (userId: string) => Promise<UserRole>;
  language: LanguageContextType["language"];
  setLanguage: LanguageContextType["setLanguage"];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<"en" | "sw">("en");

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          // Fetch profile data
          fetchProfile(data.session.user.id);
          // Fetch user role
          fetchUserRole(data.session.user.id);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Fetch profile data on auth change
          fetchProfile(newSession.user.id);
          // Fetch user role
          fetchUserRole(newSession.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "sw") {
      setLanguage(savedLanguage);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      
      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  // Inside the AuthProvider component
  const fetchUserRole = async (userId: string) => {
    try {
      // First try the RPC function
      try {
        console.log("Calling get_user_role_fixed with userId:", userId);
        const { data, error } = await supabase.rpc('get_user_role_fixed', {
          p_user_id: userId
        });
        
        if (error) {
          console.error("Error from get_user_role_fixed:", error);
          throw error;
        }
        
        console.log("Result from get_user_role_fixed:", data);
        
        // If the user has a role, set it in state and update user object
        if (data) {
          const userRole = data as UserRole;
          console.log("Setting userRole state to:", userRole);
          setUserRole(userRole);
          
          // IMPORTANT: We also need to update the user object's app_metadata
          if (user) {
            // Create a new user object with updated app_metadata
            const updatedUser = {
              ...user,
              app_metadata: {
                ...user.app_metadata,
                role: userRole
              }
            };
            
            // Update the user state with the new metadata
            console.log("Updating user object with app_metadata.role:", userRole);
            setUser(updatedUser);
          }
          
          return userRole;
        }
      } catch (rpcError: any) {
        console.warn("RPC function not available, falling back to direct query:", rpcError.message);
        
        // Fallback: Query the user_roles table directly
        console.log("Querying user_roles table directly for userId:", userId);
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single();
        
        if (roleError) {
          console.error("Error querying user_roles:", roleError);
        }
        
        if (!roleError && roleData && roleData.role) {
          const userRole = roleData.role as UserRole;
          console.log("Found role in user_roles table:", userRole);
          setUserRole(userRole);
          
          // Update the user object's app_metadata
          if (user) {
            const updatedUser = {
              ...user,
              app_metadata: {
                ...user.app_metadata,
                role: userRole
              }
            };
            
            setUser(updatedUser);
          }
          
          return userRole;
        }
      }
      
      // If we reach here, set default role
      console.log("No role found, defaulting to 'user'");
      setUserRole('user');
      
      // Update user app_metadata with default role
      if (user) {
        const updatedUser = {
          ...user,
          app_metadata: {
            ...user.app_metadata,
            role: 'user'
          }
        };
        
        setUser(updatedUser);
      }
      
      return 'user';
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole('user');
      
      // Update user app_metadata with default role
      if (user) {
        const updatedUser = {
          ...user,
          app_metadata: {
            ...user.app_metadata,
            role: 'user'
          }
        };
        
        setUser(updatedUser);
      }
      
      return 'user';
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Update the value object to include fetchUserRole and all required properties
  const value = {
    user,
    session,
    profile,
    userRole,
    isLoading,
    signOut,
    fetchUserRole,
    language,
    setLanguage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
