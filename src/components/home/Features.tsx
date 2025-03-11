
import { 
  MessageSquare, 
  LineChart, 
  Bell, 
  Users, 
  Globe, 
  Clock, 
  Shield, 
  Smartphone 
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div 
      className="glass rounded-xl p-6 flex flex-col items-center text-center card-hover animate-fade-up" 
      style={{ animationDelay: delay }}
    >
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Simple Submission",
      description: "Submit your feedback quickly and easily with our user-friendly form.",
      delay: "0s"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Real-Time Tracking",
      description: "Track the status of your submissions with real-time updates.",
      delay: "0.1s"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community Engagement",
      description: "Join discussions and upvote common issues to help prioritize solutions.",
      delay: "0.2s"
    },
    {
      icon: <LineChart className="h-6 w-6 text-primary" />,
      title: "Data Insights",
      description: "Administrators can analyze trends and prioritize urgent matters.",
      delay: "0.3s"
    },
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: "Notifications",
      description: "Receive SMS and email alerts about updates on your feedback.",
      delay: "0.4s"
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Multilingual Support",
      description: "Platform available in Swahili, English, and other languages.",
      delay: "0.5s"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure & Private",
      description: "Your information is protected with end-to-end encryption.",
      delay: "0.6s"
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Mobile Optimized",
      description: "Access the platform from any device with our responsive design.",
      delay: "0.7s"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground">
            Designed to make citizen engagement with government simple, transparent, and effective.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
}
