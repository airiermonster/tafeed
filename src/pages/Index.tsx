
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CategorySection } from "@/components/home/CategoryCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <Features />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
