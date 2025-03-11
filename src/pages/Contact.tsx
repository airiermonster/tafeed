
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 animate-fade-up">Contact Us</h1>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="glass p-8 rounded-xl">
                  <h2 className="text-2xl font-semibold mb-6 text-left">Get in Touch</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="johndoe@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message here..."
                        rows={5}
                        required
                        className="resize-none"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
              
              <div className="space-y-8 text-left animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Have questions about submitting feedback or need assistance with the platform?
                    Our dedicated team is here to help you.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Main Office</h3>
                        <p className="text-muted-foreground">
                          Tanzania Feedback Center<br />
                          1 Freedom Avenue<br />
                          Dodoma, Tanzania
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-muted-foreground">+255 22 123 4567</p>
                        <p className="text-muted-foreground">Toll-free: 0800 123 456</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">info@tafeed.go.tz</p>
                        <p className="text-muted-foreground">support@tafeed.go.tz</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-xl font-medium mb-4">Operating Hours</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday & Public Holidays:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
                
                <div className="glass p-6 rounded-xl bg-primary/5">
                  <h3 className="text-xl font-medium mb-4">Regional Offices</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We have regional feedback offices in all 31 regions of Tanzania:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Arusha</div>
                    <div>Dar es Salaam</div>
                    <div>Mwanza</div>
                    <div>Zanzibar</div>
                    <div>Mbeya</div>
                    <div>Tanga</div>
                    <div>Morogoro</div>
                    <div>Tabora</div>
                    <div>Iringa</div>
                    <div>Kigoma</div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" size="sm" className="text-xs">
                      View All Regional Offices
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
