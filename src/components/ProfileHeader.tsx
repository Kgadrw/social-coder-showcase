import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import profilePicture from "@/assets/profile-picture.jpg";
import coverImage from "@/assets/cover-nature.jpg";
import { ThemeToggle } from "./ThemeToggle";

export function ProfileHeader() {
  return (
    <Card className="border-0 shadow-profile overflow-hidden">
      {/* Cover Image */}
      <div 
        className="h-56 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <ThemeToggle />
         <a 
  href="https://github.com/Kgadrw" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Button 
    variant="secondary" 
    size="sm"
    className="bg-white/90 hover:bg-white text-foreground shadow-card backdrop-blur-sm"
  >
    <ExternalLink className="w-4 h-4 mr-2" />
    View My Work
  </Button>
</a>

        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-8">
        <div className="flex flex-col items-center -mt-20">
          {/* Profile Picture */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-green-600 shadow-profile bg-white">
            <img 
              src={profilePicture} 
              alt="GAD KALISA" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + Career under cover */}
          <h1 className="mt-4 text-3xl font-bold text-foreground">GAD KALISA</h1>
          <p className="text-lg text-foreground/80 font-medium">
            Frontend Web Developer | UI/UX Designer
          </p>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Kigali, Rwanda</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
