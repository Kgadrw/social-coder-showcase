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
        className="h-48 sm:h-56 md:h-64 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a 
            href="https://github.com/Kgadrw" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/90 hover:bg-white text-foreground shadow-card backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">View My Work</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="flex flex-col items-center -mt-16 sm:-mt-20">
          {/* Profile Picture */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-green-600 shadow-profile bg-white">
            <img 
              src={profilePicture} 
              alt="GAD KALISA" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + Career under cover */}
          <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">GAD KALISA</h1>
          <p className="text-base sm:text-lg text-foreground/80 font-medium text-center px-4">
            Frontend Web Developer | UI/UX Designer
          </p>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-sm sm:text-base">Kigali, Rwanda</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
