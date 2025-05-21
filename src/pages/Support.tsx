import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Book, Wrench } from "lucide-react";

const supportSections = [
  {
    title: "Live chat and email support for technical and medical queries",
    description: "Get immediate assistance through our live chat or reach out via email for any technical difficulties or medical questions regarding the platform.",
    icon: MessageCircle,
    bgColor: "bg-gradient-to-br from-purple-500/40 to-purple-700/50",
  },
  {
    title: "Step-by-step guide for using the platform",
    description: "Access comprehensive guides that walk you through every feature of the platform, from uploading images to interpreting results.",
    icon: Book,
    bgColor: "bg-gradient-to-br from-pink-500/40 to-pink-700/50",
  },
  {
    title: "Troubleshooting common upload or analysis issues",
    description: "Find solutions to frequently encountered problems during the image upload or analysis process with our detailed troubleshooting guides.",
    icon: Wrench,
    bgColor: "bg-gradient-to-br from-indigo-500/40 to-indigo-700/50",
  },
];

const Support = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {supportSections.map((section, index) => (
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

export default Support; 