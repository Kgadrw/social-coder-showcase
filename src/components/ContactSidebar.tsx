import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Globe, Github, Phone, Download } from "lucide-react";

type ContactItem = {
  label: string;
  value: string;
  link: string;
  color?: string;
};

type ProfileLinks = {
  github: string;
  website?: string;
  email?: string;
};

function iconForLabel(label: string) {
  const key = label.toLowerCase();
  if (key.includes("email")) return Mail;
  if (key.includes("web")) return Globe;
  if (key.includes("github")) return Github;
  return Globe;
}

const fallbackContact: ContactItem[] = [
  {
    label: "Email",
    value: "kalisagad05@gmail.com",
    link: "mailto:kalisagad05@gmail.com",
    color: "text-red-500",
  },
  {
    label: "Website",
    value: "gadkalisa.vercel.app",
    link: "https://gadkalisa.vercel.app",
    color: "text-blue-500",
  },
  {
    label: "GitHub",
    value: "github.com/Kgadrw",
    link: "https://github.com/Kgadrw",
    color: "text-gray-700",
  },
];

export function ContactSidebar({
  contact,
  profileLinks,
}: {
  contact?: ContactItem[];
  profileLinks?: ProfileLinks;
}) {
  const contactInfo = contact ?? fallbackContact;
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Info */}
      <Card className="p-4 sm:p-6 border-0 bg-primary text-primary-foreground shadow-card dark:modern-card dark:text-foreground">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary-foreground dark:text-foreground">
          Contact Information
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          {contactInfo.map((contact, index) => (
            (() => {
              const Icon = iconForLabel(contact.label);
              const isEmail = contact.label.toLowerCase().includes("email");
              const actionLabel = isEmail ? "Mail me" : "Visit";

              return (
            <a
              key={index}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-full border border-white/70 bg-white hover:bg-white/95 transition-colors dark:border-border/40 dark:bg-background/30 dark:hover:bg-background/50"
            >
              <Icon
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 dark:text-foreground"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground dark:text-foreground">{contact.label}</p>
              </div>
              <span className="text-xs font-bold underline underline-offset-4 text-primary flex-shrink-0 dark:text-foreground">
                {actionLabel}
              </span>
            </a>
              );
            })()
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="modern-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Let's Connect</h3>
        
        <div className="flex flex-nowrap gap-2">
          {/* WhatsApp Call/Text */}
          <a 
            href="https://wa.me/250791998365" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex flex-1"
          >
            <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-9 px-3" size="sm">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Schedule Call
            </Button>
          </a>

          {/* Download CV */}
          <a href="/CV.pdf" download className="inline-flex flex-1">
            <Button variant="secondary" className="w-full text-xs sm:text-sm h-8 sm:h-9 px-3" size="sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Download CV
            </Button>
          </a>
        </div>
      </Card>

    </div>
  );
}
