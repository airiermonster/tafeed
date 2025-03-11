import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryCard, categories } from "@/components/home/CategoryCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Home = () => {
  const navigate = useNavigate();
  const [displayedCategories, setDisplayedCategories] = useState(categories.slice(0, 6));
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const handleViewAllCategories = () => {
    if (showAllCategories) {
      setDisplayedCategories(categories.slice(0, 6));
    } else {
      setDisplayedCategories(categories);
    }
    setShowAllCategories(!showAllCategories);
  };
  
  const handleSelectCategory = (categoryId: string) => {
    navigate(`/feedback?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tanzania flag colors as decorative elements */}
      <div className="fixed top-0 left-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed top-0 right-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed bottom-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      <div className="fixed top-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-primary to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Voice Matters in <span className="text-primary">Tanzania</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Submit your feedback, suggestions, or concerns to help us improve public services and build a better Tanzania together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate('/feedback')}
                >
                  Submit Feedback
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate('/track')}
                >
                  Track Feedback
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Category Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose a Category</h2>
              <p className="text-muted-foreground">
                Select a category that best matches your feedback
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCategories.map((category) => (
                <div key={category.id}>
                  <CategoryCard 
                    category={category} 
                    onClick={() => handleSelectCategory(category.id)}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button 
                variant="outline" 
                onClick={handleViewAllCategories}
              >
                {showAllCategories ? "Show Less Categories" : "View All Categories"}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Community Section */}
        <section className="py-16" id="community-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with fellow citizens, share ideas, and participate in discussions about improving our country
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Public Forums Card */}
              <div className="bg-card border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <img 
                    src="/images/discussion.svg" 
                    alt="Discussions" 
                    className="w-32 h-32 object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x300?text=Discussions';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Public Forums</h3>
                  <p className="text-muted-foreground mb-4">
                    Join discussions on important topics affecting our communities and share your insights
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Coming Soon</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Feature Coming Soon!</DialogTitle>
                        <DialogDescription>
                          We're working hard to build community forums for public discussions. Stay tuned for updates!
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Public Surveys Card */}
              <div className="bg-card border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <img 
                    src="/images/survey.svg" 
                    alt="Surveys" 
                    className="w-32 h-32 object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x300?text=Surveys';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Public Surveys</h3>
                  <p className="text-muted-foreground mb-4">
                    Participate in surveys about public services and help shape policy decisions
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Coming Soon</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Feature Coming Soon!</DialogTitle>
                        <DialogDescription>
                          Our team is developing public surveys to gather citizen opinions. Check back for updates!
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Community Events Card */}
              <div className="bg-card border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <img 
                    src="/images/events.svg" 
                    alt="Events" 
                    className="w-32 h-32 object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x300?text=Events';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Community Events</h3>
                  <p className="text-muted-foreground mb-4">
                    Find and participate in local civic events and community improvement initiatives
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Coming Soon</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Feature Coming Soon!</DialogTitle>
                        <DialogDescription>
                          We're planning to introduce community events and local initiatives. Stay connected for future updates!
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple process to submit and track your feedback
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Submit Feedback</h3>
                <p className="text-muted-foreground">
                  Choose a category and provide details about your feedback, suggestion, or concern
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Status</h3>
                <p className="text-muted-foreground">
                  Use your tracking ID to follow the progress of your feedback through our system
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Updates</h3>
                <p className="text-muted-foreground">
                  Receive notifications about your feedback as it's reviewed and resolved by moderators
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/feedback')}
              >
                Submit Your Feedback Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home; 