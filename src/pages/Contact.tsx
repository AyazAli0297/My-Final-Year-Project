import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const contacts = [
  {
    name: "Ayaz Lashari",
    email: "lasharialiayyaz@gmail.com",
    fallback: "AL",
    bgColor: "bg-blue-500/20 dark:bg-blue-500/30"
  },
  {
    name: "Ibaad Abbasi",
    email: "ibaadabbasi035@gmail.com",
    fallback: "IA",
    bgColor: "bg-green-500/20 dark:bg-green-500/30"
  },
  {
    name: "Zain Solangi",
    email: "Zainzainsolangi28@gmail.com",
    fallback: "ZS",
    bgColor: "bg-purple-500/20 dark:bg-purple-500/30"
  },
  {
    text: "Thank you for visiting our portal! For technical support or inquiries, feel free to reach out to our team. We are committed to improving healthcare through AI and value your feedback. Stay updated with our latest features by checking back regularly or contacting us directly.",
    isHorizontal: true,
    bgColor: "bg-yellow-500/20 dark:bg-yellow-500/30"
  }
];

const Contact = () => {
  return (
    <div className="py-12 px-4 w-full min-h-[calc(100vh-4rem)] flex flex-col items-start">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary w-full">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-xl mx-auto">
        {contacts.map((contact, index) => (
          <Card 
            key={index} 
            className={`flex ${contact.isHorizontal ? 'flex-row items-center' : 'flex-col items-center text-center'} p-8 rounded-lg shadow-lg border border-border 
                       transition-all duration-300 ease-in-out transform 
                       hover:scale-105 hover:shadow-2xl hover:border-primary 
                       animate-fade-in delay-service-card ${contact.bgColor} ${contact.isHorizontal ? 'lg:col-span-3' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {!contact.isHorizontal && (
              <Avatar className="w-24 h-24 mb-6 shadow-md">
                {/* You can add AvatarImage here if you have actual images */}
                <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground border-2 border-primary-foreground">{contact.fallback}</AvatarFallback>
              </Avatar>
            )}
            <CardHeader className={`${contact.isHorizontal ? 'p-0 mr-6' : 'p-0 mb-3'} flex-grow`}>
              {contact.name && <CardTitle className="text-2xl font-semibold text-foreground">{contact.name}</CardTitle>}
            </CardHeader>
            <CardContent className={`${contact.isHorizontal ? 'p-0' : 'p-0'} text-${contact.isHorizontal ? 'left' : 'center'} flex-grow flex items-center justify-center`}>
              {contact.email && (
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
                  target="_blank" // Open in a new tab
                  rel="noopener noreferrer" // Security best practice
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out 
                             flex items-center ${contact.isHorizontal ? '' : 'justify-center'} gap-2 text-lg"
                >
                  <Mail className="w-6 h-6" />
                  {contact.email}
                </a>
              )}
               {contact.text && (
                <p className="text-lg leading-relaxed text-foreground">
                  {contact.text}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contact; 