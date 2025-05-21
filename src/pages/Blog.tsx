import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FlaskConical, Camera } from "lucide-react";

const blogSections = [
  {
    title: "Articles on how AI is transforming medical diagnostics",
    description: "Here you can find articles discussing the revolutionary impact of artificial intelligence on medical diagnostics, focusing on how AI models are improving accuracy and efficiency in identifying various medical conditions from imaging data.",
    icon: FlaskConical,
    bgColor: "bg-gradient-to-br from-blue-500/40 to-blue-700/50",
  },
  {
    title: "Case studies on pneumonia and tuberculosis detection using ML",
    description: "Explore detailed case studies showcasing the successful application of machine learning models in detecting specific diseases like pneumonia and tuberculosis from chest X-rays. These studies highlight the performance and potential of AI in real-world diagnostic scenarios.",
    icon: FileText,
    bgColor: "bg-gradient-to-br from-green-500/40 to-green-700/50",
  },
  {
    title: "Best practices for capturing and uploading X-ray images",
    description: "Learn about the recommended best practices for capturing high-quality chest X-ray images and effectively uploading them to our platform. Following these guidelines ensures optimal input for the AI analysis, leading to more accurate and reliable diagnostic insights.",
    icon: Camera,
    bgColor: "bg-gradient-to-br from-purple-500/40 to-purple-700/50",
  },
];

const Blog = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogSections.map((section, index) => (
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

export default Blog; 