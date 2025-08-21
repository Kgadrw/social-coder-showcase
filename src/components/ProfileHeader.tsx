import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import profilePicture from "@/assets/profile-picture.jpg";

export function ProfileHeader() {
  return (
    <Card className="bg-gradient-hero border-0 shadow-profile overflow-hidden">
      <div className="bg-gradient-primary h-32 relative"></div>
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