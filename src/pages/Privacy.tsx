import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileWarning, Database, ScrollText } from "lucide-react";

const privacySections = [
  {
    title: "1. Data Collection",
    description: "We only collect X-ray images and basic user inputs for diagnostic purposes.",
    icon: Database,
    bgColor: "bg-gradient-to-br from-teal-500/40 to-teal-700/50",
  },
  {
    title: "2. Data Usage",
    description: "Uploaded data is used exclusively to generate disease predictions and is not shared with third parties.",
    icon: ScrollText,
    bgColor: "bg-gradient-to-br from-indigo-500/40 to-indigo-700/50",
  },
  {
    title: "3. Security Practices",
    description: "All user data is encrypted and stored securely with restricted access.",
    icon: Shield,
    bgColor: "bg-gradient-to-br from-purple-500/40 to-purple-700/50",
  },
  {
    title: "4. User Rights",
    description: "Users can request deletion of their data at any time by contacting our support team.",
    icon: FileWarning,
    bgColor: "bg-gradient-to-br from-red-500/40 to-red-700/50",
  },
];

const Privacy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Privacy Policy</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {privacySections.map((section, index) => (
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

export default Privacy;