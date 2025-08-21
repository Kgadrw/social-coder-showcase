import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import profilePicture from "@/assets/profile-picture.jpg";
import coverImage from "@/assets/cover-nature.jpg";

export function ProfileHeader() {
  return (
    <Card className="bg-gradient-hero border-0 shadow-profile overflow-hidden">
      <div 
        className="h-32 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute top-4 right-4 z-20">
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-white/90 hover:bg-white text-foreground shadow-card backdrop-blur-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View My Work
          </Button>
        </div>
      </div>
      <div className="px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-profile bg-white">
            <img 
              src={profilePicture} 
              alt="GAD KALISA" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 sm:pb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">GAD KALISA</h1>
            <p className="text-xl text-muted-foreground mb-3">
              Frontend Web Developer | UI/UX Designer
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}