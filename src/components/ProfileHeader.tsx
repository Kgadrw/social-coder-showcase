import {
  MapPin,
  Shield,
  LogOut,
  Linkedin,
  Mail,
  Instagram,
  Github,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import profilePicture from "@/assets/profile-picture.jpg";
import coverImage from "@/assets/cover-nature.jpg";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { logout } from "@/lib/api";
import { useAdminSession } from "@/hooks/useAdminSession";

type ProfileContent = {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  links: { github: string; website?: string; email?: string };
  socials: { id: string; platform: string; url: string }[];
};

type EducationContent = {
  school: string;
  degree: string;
  period: string;
  imageUrl?: string;
};

type ExperienceContent = {
  role: string;
  company: string;
  companyImageUrl?: string;
  period: string;
};

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";
  return `${base}${url}`;
}

function socialIcon(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("linkedin")) return Linkedin;
  if (key.includes("mail") || key.includes("email")) return Mail;
  if (key.includes("instagram")) return Instagram;
  if (key.includes("github")) return Github;
  return Globe;
}

function socialColorClasses(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("linkedin")) {
    return "bg-[#0A66C2] text-white border-[#0A66C2]";
  }
  if (key.includes("mail") || key.includes("email")) {
    return "bg-[#EA4335] text-white border-[#EA4335]";
  }
  if (key.includes("instagram")) {
    return "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white border-transparent";
  }
  if (key.includes("github")) {
    return "bg-[#24292F] text-white border-[#24292F]";
  }
  return "bg-primary text-primary-foreground border-primary";
}

export function ProfileHeader({
  content,
  education,
  currentExperience,
}: {
  content?: ProfileContent;
  education?: EducationContent;
  currentExperience?: ExperienceContent;
}) {
  const me = useAdminSession();
  const loggedIn = Boolean(me.data?.isAdmin);
  const avatarSrc = content?.avatarUrl || profilePicture;
  const coverSrc = content?.coverUrl || coverImage;
  const name = content?.name || "GAD KALISA";
  const title = content?.title || "Frontend Web Developer | UI/UX Designer";
  const location = content?.location || "Kigali, Rwanda";
  const school = education?.school || "University of the People";
  const degree = education?.degree || "Bachelor of Science in Computer Science";
  const educationPeriod = education?.period || "2024 - 2028";
  const educationImage = education?.imageUrl;
  const currentRole = currentExperience?.role || "Software Engineer";
  const currentCompany = currentExperience?.company || "Current Role";
  const currentCompanyImage = currentExperience?.companyImageUrl;
  const currentWorkPeriod = currentExperience?.period || "Present";
  const socials = content?.socials ?? [];

  return (
    <Card className="border-0 shadow-profile overflow-hidden">
      {/* Cover Image */}
      <div 
        className="h-28 sm:h-32 md:h-36 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${coverSrc})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {loggedIn ? (
            <>
              <Link to="/admin">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary text-primary-foreground shadow-card text-xs sm:text-sm px-3 sm:px-4 border border-primary hover:opacity-95 dark:border-white/10 dark:bg-sky-500 dark:text-white"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout().finally(() => window.location.reload());
                }}
                  className="bg-primary text-primary-foreground shadow-card text-xs sm:text-sm px-3 sm:px-4 border border-primary hover:opacity-95 dark:border-white/10 dark:bg-rose-500 dark:text-white"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between -mt-14 sm:-mt-16">
          <div className="flex flex-col items-start">
            {/* Profile Picture */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/80 bg-white">
              <img 
                src={avatarSrc}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Career under cover */}
            <div className="mt-3 flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-left">
                {name}
              </h1>
              <img
                src="/verified.png"
                alt="Verified"
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                loading="lazy"
              />
            </div>
            <p className="text-base sm:text-lg text-foreground/80 font-medium text-left">
              {title}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium text-sm sm:text-base">{location}</span>
              </div>
              {socials.length ? (
                <div className="flex items-center -space-x-2">
                  {socials.map((social) => {
                    const Icon = socialIcon(social.platform);
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                        rel={social.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className={`h-8 w-8 rounded-full border shadow-card flex items-center justify-center hover:opacity-90 transition-colors ${socialColorClasses(social.platform)}`}
                        aria-label={social.platform}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[250px] rounded-xl border border-border/60 bg-transparent px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Education
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center flex-shrink-0">
                {educationImage ? (
                  <img
                    src={resolveImageUrl(educationImage)}
                    alt={school}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-foreground">
                    {school.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold text-foreground leading-tight">{school}</div>
                  <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {educationPeriod}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{degree}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Current work
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center flex-shrink-0">
                  {currentCompanyImage ? (
                    <img
                      src={resolveImageUrl(currentCompanyImage)}
                      alt={currentCompany}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-foreground">
                      {currentCompany.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium text-foreground leading-tight">
                      {currentRole}
                    </div>
                    <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {currentWorkPeriod}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {currentCompany}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
