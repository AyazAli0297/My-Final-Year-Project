import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShieldOff, Lock } from "lucide-react";

const termsSections = [
  {
    title: "1. Usage Guidelines",
    description: "Users must upload authentic and clear chest X-ray images. The platform is designed for preliminary diagnostics and not a substitute for professional medical advice.",
    icon: FileText,
    bgColor: "bg-gradient-to-br from-blue-500/40 to-blue-700/50",
  },
  {
    title: "2. Limitation of Liability",
    description: "While our AI strives for accuracy, we are not liable for any medical decisions made solely based on our model's output.",
    icon: ShieldOff,
    bgColor: "bg-gradient-to-br from-red-500/40 to-red-700/50",
  },
  {
    title: "3. Account Responsibilities",
    description: "Users are responsible for maintaining the confidentiality of their login credentials and account information.",
    icon: Lock,
    bgColor: "bg-gradient-to-br from-green-500/40 to-green-700/50",
  },
  {
    title: "4. Prohibited Activities",
    description: "Any misuse, reverse engineering, or unauthorized access attempts will lead to immediate account suspension.",
    icon: ShieldOff,
    bgColor: "bg-gradient-to-br from-yellow-500/40 to-yellow-700/50",
  },
];

const Terms = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Terms of Service</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {termsSections.map((section, index) => (
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

export default Terms; 