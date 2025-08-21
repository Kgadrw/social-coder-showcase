import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { WorkExperience } from "@/components/WorkExperience";
import { EducationCard } from "@/components/EducationCard";
import { CertificationsPanel } from "@/components/CertificationsPanel";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ContactSidebar } from "@/components/ContactSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Profile Header - Full Width */}
        <div className="mb-8">
          <ProfileHeader />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left & Center */}
          <div className="lg:col-span-2 space-y-8">
            <AboutSection />
            <WorkExperience />
            
            {/* Education and Skills Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <EducationCard />
              <div className="space-y-8">
                <SkillsGrid />
              </div>
            </div>
            
            <CertificationsPanel />
          </div>
          
          {/* Sidebar - Right */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ContactSidebar />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center text-muted-foreground">
          <p className="text-sm">
            © 2024 GAD KALISA. Crafted with passion for exceptional web experiences.
          </p>
          <p className="text-xs mt-2">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;