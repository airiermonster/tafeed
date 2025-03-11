import { Link } from "react-router-dom";

// Icons
import { 
  Droplet, 
  Zap, 
  Route,
  Heart, 
  GraduationCap, 
  Leaf, 
  Shield, 
  Home, 
  BarChart, 
  Users,
  Building,
  Globe,
  Scale,
  Landmark,
  FileText,
  Fish,
  Briefcase,
  Mountain,
  Palmtree,
  MapPin,
  Clock,
  Building2,
  AreaChart,
  Construction,
  Smartphone,
  Swords,
  ShoppingBag,
  BookOpen,
  BadgeCheck,
  Map,
  Coins
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const categories: Category[] = [
  {
    id: "water",
    name: "Water & Irrigation",
    description: "Issues related to water access, quality, and irrigation infrastructure.",
    icon: <Droplet className="h-12 w-12" />,
    color: "bg-blue-500/20 text-blue-600 dark:text-blue-400"
  },
  {
    id: "electricity",
    name: "Energy Sector",
    description: "Power outages, energy access, and related infrastructure issues.",
    icon: <Zap className="h-12 w-12" />,
    color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
  },
  {
    id: "transport",
    name: "Transportation Infrastructure",
    description: "Road conditions, bridges, public transport, and traffic management.",
    icon: <Route className="h-12 w-12" />,
    color: "bg-gray-500/20 text-gray-600 dark:text-gray-400"
  },
  {
    id: "healthcare",
    name: "Health",
    description: "Access to healthcare services, facilities, and public health concerns.",
    icon: <Heart className="h-12 w-12" />,
    color: "bg-red-500/20 text-red-600 dark:text-red-400"
  },
  {
    id: "education",
    name: "Education & Training",
    description: "Schools, universities, educational resources, and teaching quality.",
    icon: <GraduationCap className="h-12 w-12" />,
    color: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
  },
  {
    id: "environment",
    name: "Environment Sector",
    description: "Pollution, waste management, conservation, and climate change.",
    icon: <Leaf className="h-12 w-12" />,
    color: "bg-green-500/20 text-green-600 dark:text-green-400"
  },
  {
    id: "security",
    name: "Defense & Security",
    description: "Law enforcement, fire services, emergency response, and national security.",
    icon: <Shield className="h-12 w-12" />,
    color: "bg-purple-500/20 text-purple-600 dark:text-purple-400"
  },
  {
    id: "lands",
    name: "Land Sector",
    description: "Land rights, planning, surveying, and land management.",
    icon: <MapPin className="h-12 w-12" />,
    color: "bg-orange-500/20 text-orange-600 dark:text-orange-400"
  },
  {
    id: "finance",
    name: "Finance Sector",
    description: "Government financial services, taxation, and economic policies.",
    icon: <Coins className="h-12 w-12" />,
    color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
  },
  {
    id: "social",
    name: "Community Development",
    description: "Social welfare, community services, and support for vulnerable groups.",
    icon: <Users className="h-12 w-12" />,
    color: "bg-pink-500/20 text-pink-600 dark:text-pink-400"
  },
  {
    id: "trade",
    name: "Trade Assessment Committee",
    description: "Evaluation and regulation of trade practices and policies.",
    icon: <ShoppingBag className="h-12 w-12" />,
    color: "bg-blue-600/20 text-blue-700 dark:text-blue-300"
  },
  {
    id: "foreign",
    name: "Foreign Affairs",
    description: "International relations, embassy services, and diplomatic matters.",
    icon: <Globe className="h-12 w-12" />,
    color: "bg-violet-500/20 text-violet-600 dark:text-violet-400"
  },
  {
    id: "judiciary",
    name: "Judiciary",
    description: "Court services, legal matters, and judicial processes.",
    icon: <Scale className="h-12 w-12" />,
    color: "bg-slate-500/20 text-slate-600 dark:text-slate-400"
  },
  {
    id: "home",
    name: "Home Affairs",
    description: "Immigration, citizenship, and domestic governance matters.",
    icon: <Home className="h-12 w-12" />,
    color: "bg-amber-500/20 text-amber-600 dark:text-amber-400"
  },
  {
    id: "governance",
    name: "Governance & Leadership",
    description: "Public administration, leadership, and governance practices.",
    icon: <Landmark className="h-12 w-12" />, // Replaced Government with Landmark
    color: "bg-red-800/20 text-red-900 dark:text-red-300"
  },
  {
    id: "fisheries",
    name: "Life & Fisheries",
    description: "Fishing industry, aquatic resources, and livelihood matters.",
    icon: <Fish className="h-12 w-12" />,
    color: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
  },
  {
    id: "labor",
    name: "Labor & Employment",
    description: "Employment rights, labor standards, and workplace conditions.",
    icon: <Briefcase className="h-12 w-12" />,
    color: "bg-orange-600/20 text-orange-700 dark:text-orange-300"
  },
  {
    id: "mining",
    name: "Mining Sector",
    description: "Mining operations, mineral rights, and industry regulations.",
    icon: <Mountain className="h-12 w-12" />,
    color: "bg-gray-600/20 text-gray-700 dark:text-gray-300"
  },
  {
    id: "tourism",
    name: "Natural Resources & Tourism",
    description: "Tourism industry, natural resources management, and conservation.",
    icon: <Palmtree className="h-12 w-12" />,
    color: "bg-teal-500/20 text-teal-600 dark:text-teal-400"
  },
  {
    id: "architecture",
    name: "Architecture & Statistics",
    description: "Architectural standards, statistical data, and related services.",
    icon: <Building className="h-12 w-12" />,
    color: "bg-indigo-600/20 text-indigo-700 dark:text-indigo-300"
  },
  {
    id: "construction",
    name: "Construction & Survey",
    description: "Construction projects, surveying, and infrastructure development.",
    icon: <Construction className="h-12 w-12" />,
    color: "bg-yellow-600/20 text-yellow-700 dark:text-yellow-300"
  },
  {
    id: "ict",
    name: "Communications & Information Technology",
    description: "Telecommunications, IT services, and digital infrastructure.",
    icon: <Smartphone className="h-12 w-12" />,
    color: "bg-blue-700/20 text-blue-800 dark:text-blue-200"
  },
  {
    id: "industry",
    name: "Industry & Trade",
    description: "Industrial development, manufacturing, and trade regulations.",
    icon: <Building2 className="h-12 w-12" />,
    color: "bg-slate-600/20 text-slate-700 dark:text-slate-300"
  },
  {
    id: "constitution",
    name: "Constitution & Law",
    description: "Constitutional affairs, legal frameworks, and legislation.",
    icon: <FileText className="h-12 w-12" />,
    color: "bg-purple-600/20 text-purple-700 dark:text-purple-300"
  },
  {
    id: "sports",
    name: "Arts & Sports",
    description: "Cultural activities, arts development, and sporting events.",
    icon: <Swords className="h-12 w-12" />,
    color: "bg-rose-500/20 text-rose-600 dark:text-rose-400"
  },
  {
    id: "agriculture",
    name: "Agriculture Sector",
    description: "Farming, agricultural resources, and food production.",
    icon: <Leaf className="h-12 w-12" />,
    color: "bg-lime-500/20 text-lime-600 dark:text-lime-400"
  },
  {
    id: "regions",
    name: "Districts & Regions",
    description: "Local governance, regional development, and district affairs.",
    icon: <Map className="h-12 w-12" />,
    color: "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300"
  },
  {
    id: "ministry",
    name: "All Ministries",
    description: "General feedback applicable to all government ministries.",
    icon: <Landmark className="h-12 w-12" />,
    color: "bg-gray-700/20 text-gray-800 dark:text-gray-200"
  }
];

interface CategoryCardProps {
  category: Category;
  index?: number;
  onClick?: () => void;
}

export function CategoryCard({ category, index = 0, onClick }: CategoryCardProps) {
  return (
    <div 
      className="h-full glass rounded-xl p-6 flex flex-col card-hover animate-fade-up cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className={`rounded-xl p-4 mb-4 ${category.color}`}>
        {category.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
      <p className="text-muted-foreground text-sm flex-grow">{category.description}</p>
    </div>
  );
}

export function CategorySection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">Issue Categories</h2>
          <p className="text-xl text-muted-foreground">
            Choose a category that best matches your feedback or concern.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
