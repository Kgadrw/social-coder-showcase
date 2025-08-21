import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import profilePicture from "@/assets/profile-picture.jpg";
import coverImage from "@/assets/cover-nature.jpg";

export function ProfileHeader() {
  return (
    <Card className="bg-white border-0 shadow-profile overflow-hidden">
      {/* Cover Image */}
      <div 
        className="h-48 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute top-6 right-6 z-20">
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

      {/* Profile Info Section */}
      <div className="px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
          {/* Profile Picture */}
          <div className="w-36 h-36 rounded-full overflow-hidden border-6 border-white shadow-profile bg-white">
            <img 
              src={profilePicture} 
              alt="GAD KALISA" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + Career directly under cover */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">GAD KALISA</h1>
            <p className="text-lg text-gray-700 font-medium">
              Frontend Web Developer | UI/UX Designer
            </p>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
