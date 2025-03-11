
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryCard, categories } from "@/components/home/CategoryCard";

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-4">Feedback Categories</h1>
            <p className="text-xl text-muted-foreground">
              Browse all categories to find the most appropriate one for your feedback.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
