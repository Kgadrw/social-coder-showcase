import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Globe, Github, MessageCircle, Phone, Download } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "kalisagad05@gmail.com",
    link: "mailto:kalisagad05@gmail.com",
    color: "text-red-500"
  },
  {
    icon: Globe,
    label: "Website", 
    value: "gadkalisa.vercel.app",
    link: "https://gadkalisa.vercel.app",
    color: "text-blue-500"
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Kgadrw",
    link: "https://github.com/Kgadrw",
    color: "text-gray-700"
  }
];

export function ContactSidebar() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Info */}
      <Card className="modern-card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Contact Information</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {contactInfo.map((contact, index) => (
            <a
              key={index}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <contact.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${contact.color} group-hover:scale-110 transition-transform flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground">{contact.label}</p>
                <p className="text-xs text-muted-foreground truncate">{contact.value}</p>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="modern-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Let's Connect</h3>
        
        <div className="space-y-2 sm:space-y-3">
          {/* Send Email */}
          <a href="mailto:kalisagad05@gmail.com">
            <Button className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300 text-xs sm:text-sm h-8 sm:h-9" size="sm">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Send Message
            </Button>
          </a>

          {/* WhatsApp Call/Text */}
          <a 
            href="https://wa.me/250791998365" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Schedule Call
            </Button>
          </a>

          {/* Download CV */}
          <a href="/CV.pdf" download>
            <Button variant="secondary" className="w-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Download CV
            </Button>
          </a>
        </div>
      </Card>

      {/* Availability */}
      <Card className="modern-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Availability</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
          <span className="text-xs sm:text-sm font-medium text-foreground">Available for work</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Open to frontend development and UI/UX design opportunities
        </p>
      </Card>
    </div>
  );
}
