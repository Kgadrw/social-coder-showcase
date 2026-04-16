export type ActivityPost = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  imageAlt?: string;
};

export type ProjectCategory = "Individual" | "Team" | "Open Source" | "Client";

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  links: ProjectLink[];
  tech: string[];
  featured?: boolean;
};

export type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  link?: string;
};

export type SidebarBanner = {
  id: string;
  link?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type PortfolioContent = {
  profile: {
    name: string;
    title: string;
    location: string;
    avatarUrl: string;
    coverUrl: string;
    links: {
      github: string;
      website?: string;
      email?: string;
    };
    socials: SocialLink[];
  };
  about: {
    text: string;
    coreCompetencies: string[];
  };
  education: {
    degree: string;
    school: string;
    period: string;
    summary: string;
    tags: string[];
    imageUrl?: string;
  };
  experiences: {
    role: string;
    company: string;
    industry?: string;
    companyImageUrl?: string;
    period: string;
    location: string;
    type: string;
    description: string;
  }[];
  projects: Project[];
  articles: Article[];
  skills: {
    name: string;
    level: number;
    color: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
    type: string;
    verified: boolean;
    imageUrl?: string;
    imageAlt?: string;
    link?: string;
  }[];
  contact: {
    label: string;
    value: string;
    link: string;
    color?: string;
  }[];
  sidebarBanners: SidebarBanner[];
  activityPosts: ActivityPost[];
};

