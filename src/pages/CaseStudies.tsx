import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BarChart } from "lucide-react";

const caseStudiesSections = [
  {
    title: "Real-world examples of how our tool helped doctors make faster decisions",
    description: "Explore practical scenarios where our AI-powered tool has significantly reduced diagnostic time, allowing medical professionals to make quicker and more informed decisions for patient care.",
    icon: BookOpen,
    bgColor: "bg-gradient-to-br from-orange-500/40 to-orange-700/50",
  },
  {
    title: "Data-driven insights from actual deployment in clinics",
    description: "Dive into the analytics and results from the real-world implementation of our platform in various clinics, demonstrating its effectiveness and impact on healthcare workflows.",
    icon: BarChart,
    bgColor: "bg-gradient-to-br from-cyan-500/40 to-cyan-700/50",
  },
];

const CaseStudies = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Case Studies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {caseStudiesSections.map((section, index) => (
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

export default CaseStudies; 