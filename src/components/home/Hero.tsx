
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquarePlus, LogIn } from "lucide-react";
import { TrackingForm } from "@/components/tracking/TrackingForm";

export function Hero() {
  const { user, language } = useAuth();

  // Translations
  const translations = {
    en: {
      title: "Your Voice Matters in Building a Better Tanzania",
      subtitle: "Share your feedback on public services and infrastructure. Help us create positive change in our communities.",
      submitFeedback: "Submit Feedback",
      loginToSubmit: "Login to Submit",
      viewCategories: "View Categories"
    },
    sw: {
      title: "Sauti Yako Inasaidia Kujenga Tanzania Bora",
      subtitle: "Shiriki maoni yako kuhusu huduma za umma na miundombinu. Tusaidie kuunda mabadiliko chanya katika jamii zetu.",
      submitFeedback: "Tuma Maoni",
      loginToSubmit: "Ingia Kutuma",
      viewCategories: "Tazama Jamii"
    }
  };

  const t = translations[language];

  return (
    <section className="relative">
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/60 opacity-90"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 tz-pattern"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center py-20 md:py-28 gap-8">
          {/* Hero content */}
          <div className="md:w-1/2 text-white text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {t.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {user ? (
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/submit-feedback">
                    <MessageSquarePlus className="mr-2 h-5 w-5" />
                    {t.submitFeedback}
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    <LogIn className="mr-2 h-5 w-5" />
                    {t.loginToSubmit}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/categories">
                  {t.viewCategories}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Tracking form card */}
          <div className="md:w-1/2 w-full max-w-md mx-auto md:mx-0 mt-8 md:mt-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <TrackingForm />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative wave shape at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ 
        clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
        opacity: 0.9
      }}></div>
    </section>
  );
}
