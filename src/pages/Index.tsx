import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { ActivitySection } from "@/components/ActivitySection";
import { WorkExperience } from "@/components/WorkExperience";
import { EducationCard } from "@/components/EducationCard";
import { CertificationsPanel } from "@/components/CertificationsPanel";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturedLinksCard } from "@/components/FeaturedLinksCard";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { login } from "@/lib/api";
import { useAdminSession } from "@/hooks/useAdminSession";

const Index = () => {
  const navigate = useNavigate();
  const { data, isLoading } = usePortfolioContent();
  const me = useAdminSession();
  const loggedIn = Boolean(me.data?.isAdmin);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
      setLoginOpen(false);
      setPassword("");
      navigate("/admin");
    } catch {
      setError("Invalid password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        {/* Main Content Grid (header-left, sidebar-right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 lg:gap-8">
          {/* Main content (feed) */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {isLoading ? (
              <div className="text-muted-foreground text-sm">Loading…</div>
            ) : null}

            {/* Header (left column) */}
            <ProfileHeader
              content={data?.profile}
              education={data?.education}
              currentExperience={data?.experiences?.[0]}
            />

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start h-auto gap-1">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <AboutSection content={data?.about} />
                  <CertificationsPanel certifications={data?.certifications} />
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <ActivitySection posts={data?.activityPosts} />
              </TabsContent>

              <TabsContent value="experience">
                <WorkExperience experiences={data?.experiences} />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsSection projects={data?.projects} />
              </TabsContent>

              <TabsContent value="articles">
                <ArticlesSection articles={data?.articles} />
              </TabsContent>

              <TabsContent value="education">
                <EducationCard content={data?.education} />
              </TabsContent>
            </Tabs>

          </div>
          
          {/* Right sidebar */}
          <div className="lg:order-last">
            <div className="lg:sticky lg:top-6 space-y-4 sm:space-y-6">
              <FeaturedLinksCard content={data} />
              <div className="pt-4 text-right text-muted-foreground">
                {loggedIn ? (
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="text-xs sm:text-sm hover:text-foreground transition-colors"
                  >
                    © 2024 GAD KALISA.
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setLoginOpen(true);
                    }}
                    className="text-xs sm:text-sm hover:text-foreground transition-colors"
                  >
                    © 2024 GAD KALISA.
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={loginOpen}
          onOpenChange={(open) => {
            setLoginOpen(open);
            if (!open) {
              setPassword("");
              setError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>
                Enter your admin password to edit the portfolio.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onLoginSubmit} className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {error ? <div className="text-sm text-destructive">{error}</div> : null}

              <Button className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;