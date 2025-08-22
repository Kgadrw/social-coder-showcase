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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        {/* Profile Header - Full Width */}
        <div className="mb-6 sm:mb-8">
          <ProfileHeader />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content - Left & Center */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            <AboutSection />
            <WorkExperience />
            
            {/* Education and Skills Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <EducationCard />
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <SkillsGrid />
              </div>
            </div>
            
            <CertificationsPanel />
          </div>
          
          {/* Sidebar - Right */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-6">
              <ContactSidebar />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50 text-center text-muted-foreground">
          <p className="text-xs sm:text-sm">
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