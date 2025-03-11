
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6 animate-fade-up">
              <img src="/logo.png" alt="Tanzania Feedback Logo" className="h-16 w-auto mr-3" />
              <h1 className="text-4xl font-bold">About Tanzania Feedback</h1>
            </div>
            
            <div className="glass p-8 rounded-xl mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2">
                  <img 
                    src="/tanzania-coat-of-arms.png" 
                    alt="Tanzania Court of Arms" 
                    className="w-full max-w-[250px] mx-auto"
                  />
                </div>
                <div className="md:col-span-3 text-left">
                  <h2 className="text-2xl font-semibold mb-4">Official Government Platform</h2>
                  <p className="text-muted-foreground mb-4">
                    Tanzania Feedback (Tafeed) is an initiative by the Government of Tanzania 
                    designed to create a direct communication channel between citizens and government officials.
                  </p>
                  <p className="text-muted-foreground">
                    Our mission is to improve public services and infrastructure by facilitating 
                    an open dialogue where citizens can express their concerns, suggestions, and commendations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-12">
              <section className="text-left animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-muted-foreground mb-4">
                  To create a responsive, accountable, and transparent governance system in Tanzania 
                  that actively involves citizens in the decision-making process and public service improvement.
                </p>
                <p className="text-muted-foreground">
                  We envision a Tanzania where every citizen's voice matters and contributes to the 
                  development of our nation, aligned with our national motto: "Uhuru na Umoja" (Freedom and Unity).
                </p>
              </section>
              
              <section className="text-left animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-xl font-medium mb-2">1. Submit Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a category, describe your issue or suggestion, and submit it through our easy-to-use platform.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-xl font-medium mb-2">2. Track Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Each submission receives a unique tracking ID allowing you to monitor its status and resolution.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-xl font-medium mb-2">3. Government Action</h3>
                    <p className="text-sm text-muted-foreground">
                      Government officials review, respond to, and take appropriate action on citizen feedback.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="text-left animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Respond to all feedback within 7 working days</li>
                  <li>Protect the privacy and confidentiality of all submissions</li>
                  <li>Take concrete actions based on citizen input</li>
                  <li>Provide regular updates on the status of submissions</li>
                  <li>Continuously improve the platform based on user feedback</li>
                </ul>
              </section>
              
              <section className="text-left animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <h2 className="text-2xl font-semibold mb-4">Join Us in Building a Better Tanzania</h2>
                <p className="text-muted-foreground mb-6">
                  Your active participation helps us identify areas that need improvement and 
                  allows us to allocate resources more efficiently. Together, we can build a 
                  better Tanzania for all citizens.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/submit-feedback">Submit Your Feedback</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
