import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
        <CardHeader className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-primary to-blue-600 text-white rounded-t-lg">
          <Avatar className="w-24 h-24 mb-4 border-4 border-white">
            <AvatarFallback className="text-4xl font-bold text-primary">AI</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">About X-Ray AI</CardTitle>
          <CardDescription className="text-sm text-white opacity-90">Intelligent Chest X-Ray Disease Detection</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-card text-card-foreground rounded-b-lg">
          <p className="text-lg leading-relaxed animate-slide-up delay-100">
            Welcome to our Chest X-Ray Disease Detection Portal — an intelligent, AI-powered tool designed to assist in the early detection of chest-related diseases through medical imaging.
          </p>
          <p className="text-lg leading-relaxed animate-slide-up delay-200">
            Our platform utilizes a deep learning model trained on a vast dataset of chest X-ray images. By simply uploading an X-ray image, users receive an automated and accurate analysis of potential diseases such as pneumonia, tuberculosis, and other chest conditions.
          </p>
          <p className="text-lg leading-relaxed animate-slide-up delay-300">
            This web portal bridges the gap between cutting-edge machine learning and real-world healthcare needs, providing fast, reliable, and accessible preliminary diagnostic insights for both patients and medical professionals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About; 