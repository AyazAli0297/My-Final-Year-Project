import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, GitBranch, BarChart2 } from "lucide-react";

const documentationSections = [
  {
    title: "API integration manual for clinics and hospitals",
    description: "A comprehensive guide on integrating our API into existing clinic and hospital systems for seamless access to X-ray analysis and reporting.",
    icon: Code,
    bgColor: "bg-gradient-to-br from-orange-500/40 to-orange-700/50",
  },
  {
    title: "Model architecture overview",
    description: "An in-depth look at the underlying machine learning model architecture, explaining its components and how it processes X-ray images for disease detection.",
    icon: GitBranch,
    bgColor: "bg-gradient-to-br from-cyan-500/40 to-cyan-700/50",
  },
  {
    title: "Version history and performance metrics",
    description: "Detailed documentation on the platform's version history, including updates, improvements, and performance metrics to track accuracy and reliability.",
    icon: BarChart2,
    bgColor: "bg-gradient-to-br from-lime-500/40 to-lime-700/50",
  },
];

const Documentation = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documentationSections.map((section, index) => (
          <Card 
            key={index} 
            className={`flex flex-col p-8 rounded-lg shadow-lg border border-border 
                       transition-all duration-500 ease-in-out transform 
                       hover:scale-105 hover:shadow-xl hover:border-primary
                       animate-pop-in ${section.bgColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="p-0 mb-4 flex flex-row items-center gap-4">
               {section.icon && <section.icon className="w-12 h-12 text-primary flex-shrink-0" />}
              <CardTitle className="text-xl font-semibold text-foreground">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground leading-relaxed">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documentation; 