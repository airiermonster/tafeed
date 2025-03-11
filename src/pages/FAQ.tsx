
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, Mail } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Remove Tanzania flag colors as decorative elements */}
      
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4 animate-fade-up">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Find answers to common questions about the Tanzania Public Feedback Platform
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl shadow-md mb-10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is the Tanzania Public Feedback Platform?</AccordionTrigger>
                <AccordionContent>
                  The Tanzania Public Feedback Platform is a digital initiative that allows citizens to provide feedback on public services and infrastructure. The platform aims to improve service delivery by connecting citizen concerns directly to relevant authorities.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Do I need to create an account to submit feedback?</AccordionTrigger>
                <AccordionContent>
                  Yes, creating an account allows you to track the status of your submissions and maintain a history of your feedback. However, you can choose to remain anonymous when submitting specific feedback.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How can I track my submitted feedback?</AccordionTrigger>
                <AccordionContent>
                  After submitting feedback, you'll receive a unique tracking ID. You can use this ID on the homepage to check the status of your submission. Alternatively, if you're logged in, you can view all your submissions and their statuses in your profile dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Who reviews the submitted feedback?</AccordionTrigger>
                <AccordionContent>
                  Feedback is reviewed by a team of moderators who verify the information and forward it to the relevant authorities. For certain categories, specialized departments may directly review and respond to submissions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How long does it take to get a response?</AccordionTrigger>
                <AccordionContent>
                  Response times vary depending on the nature and complexity of the feedback. Simple inquiries may be addressed within a few days, while more complex issues that require investigation might take longer. You can always check the status of your submission using your tracking ID.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I submit feedback about any government service?</AccordionTrigger>
                <AccordionContent>
                  Yes, the platform accepts feedback across various categories related to public services, infrastructure, and governance. You can select the most appropriate category when submitting your feedback.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>Is my personal information kept confidential?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data privacy seriously. Your personal information is protected and only used to process your feedback. You can also choose to submit anonymous feedback if you prefer not to share your details.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger>How can I update my account information?</AccordionTrigger>
                <AccordionContent>
                  You can update your profile information by logging into your account and navigating to the Profile section. There, you can modify your name, contact details, region, and other personal information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="text-center">
            <p className="mb-6">Can't find an answer to your question?</p>
            <Button asChild>
              <Link to="/contact" className="inline-flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
