import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ShieldCheck, Search, Zap, Link, User, Settings } from "lucide-react";

const features = [
  {
    title: "AI-Powered X-Ray Analysis",
    description: "Instantly detect chest diseases using our advanced deep learning model trained on a large dataset of X-ray images.",
    icon: Lightbulb,
  },
  {
    title: "User-Friendly Interface",
    description: "Upload and analyze X-ray images with just a few clicks — no technical expertise required.",
    icon: User,
  },
  {
    title: "Instant Medical Report Generation",
    description: "Get a detailed and automated diagnostic report highlighting the detected condition and its severity.",
    icon: Search,
  },
  {
    title: "Multi-Disease Detection",
    description: "Capable of identifying multiple chest-related conditions such as pneumonia, tuberculosis, and more.",
    icon: Lightbulb,
  },
  {
    title: "Secure and Confidential",
    description: "We prioritize user privacy — all data is processed securely and kept confidential.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile & Desktop Compatible",
    description: "Fully responsive design ensures a seamless experience on both mobile devices and desktops.",
    icon: Settings,
  },
  {
    title: "Real-Time Prediction Feedback",
    description: "Get accurate predictions within seconds, empowering timely medical decisions.",
    icon: Zap,
  },
  {
    title: "Integration Ready",
    description: "Can be easily integrated into hospital systems or telemedicine platforms for broader use.",
    icon: Link,
  },
];

const Features = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Key Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className={`flex flex-col p-8 rounded-lg shadow-lg border border-border bg-card text-card-foreground
                       transition-all duration-500 ease-in-out transform 
                       hover:scale-105 hover:shadow-xl hover:border-primary
                       animate-pop-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="p-0 mb-4 flex flex-row items-center gap-4">
               {feature.icon && <feature.icon className="w-12 h-12 text-primary flex-shrink-0" />}
              <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;