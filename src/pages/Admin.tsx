import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Download,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Info,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Save,
  Sparkles,
  Upload,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { toast } from "@/hooks/use-toast";
import { apiFetch, logout, uploadImage } from "@/lib/api";
import type { PortfolioContent } from "@/types/portfolio";
import { useAdminSession } from "@/hooks/useAdminSession";

function uid() {
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

function safeJsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type AdminSectionId =
  | "profile"
  | "about"
  | "activity"
  | "articles"
  | "sidebar"
  | "projects"
  | "experience"
  | "certs"
  | "education";

type SectionMeta = {
  id: AdminSectionId;
  label: string;
  icon: React.ReactNode;
  hint: string;
};

function computeSectionIssues(content: PortfolioContent): Record<AdminSectionId, number> {
  const issues: Record<AdminSectionId, number> = {
    profile: 0,
    about: 0,
    activity: 0,
    articles: 0,
    sidebar: 0,
    projects: 0,
    experience: 0,
    certs: 0,
    education: 0,
  };

  const req = (v: string | undefined | null) => (String(v ?? "").trim() ? 0 : 1);

  issues.profile += req(content.profile.name);
  issues.profile += req(content.profile.title);
  issues.profile += req(content.profile.location);
  issues.profile += req(content.profile.links.github);

  issues.about += req(content.about.text);
  issues.about += content.about.coreCompetencies.length ? 0 : 1;

  issues.education += req(content.education.degree);
  issues.education += req(content.education.school);
  issues.education += req(content.education.period);

  issues.experience += content.experiences.length ? 0 : 1;
  content.experiences.forEach((e) => {
    issues.experience += req(e.role);
    issues.experience += req(e.company);
    issues.experience += req(e.period);
    issues.experience += req(e.location);
  });

  issues.certs += content.certifications.length ? 0 : 1;
  content.certifications.forEach((c) => {
    issues.certs += req(c.title);
    issues.certs += req(c.issuer);
    issues.certs += req(c.date);
  });

  issues.sidebar += content.sidebarBanners.length ? 0 : 1;
  content.sidebarBanners.forEach((b) => {
    issues.sidebar += req(b.imageUrl);
  });

  // activity is optional, but if present, make sure it’s not empty
  content.activityPosts.forEach((p) => {
    issues.activity += req(p.content);
    issues.activity += req(p.date);
  });

  content.articles.forEach((article) => {
    issues.articles += req(article.title);
    issues.articles += req(article.date);
    issues.articles += req(article.summary);
    issues.articles += req(article.content);
  });

  issues.projects += content.projects.length ? 0 : 1;
  content.projects.forEach((p) => {
    issues.projects += req(p.title);
    issues.projects += req(p.summary);
    issues.projects += req(p.category);
    p.links?.forEach((l) => {
      issues.projects += req(l.label);
      issues.projects += req(l.url);
    });
  });

  return issues;
}

export default function Admin() {
  const me = useAdminSession();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => apiFetch<PortfolioContent>("/api/admin/content"),
    enabled: Boolean(me.data?.isAdmin),
  });

  const [active, setActive] = useState<AdminSectionId>("profile");
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [autosave, setAutosave] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const saveInFlightRef = useRef(false);
  const autosaveTimerRef = useRef<number | null>(null);

  const content = draft ?? data ?? null;

  const baselineSig = useMemo(() => (data ? JSON.stringify(data) : ""), [data]);
  const draftSig = useMemo(() => (draft ? JSON.stringify(draft) : ""), [draft]);
  const isDirty = Boolean(draft) && baselineSig !== "" && draftSig !== baselineSig;

  const sections: SectionMeta[] = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
        hint: "Name, links, avatar, cover",
      },
      {
        id: "about",
        label: "About",
        icon: <Info className="h-4 w-4" />,
        hint: "Bio + core competencies",
      },
      {
        id: "activity",
        label: "Activity",
        icon: <Sparkles className="h-4 w-4" />,
        hint: "Posts feed (optional)",
      },
      {
        id: "articles",
        label: "Articles",
        icon: <BookOpen className="h-4 w-4" />,
        hint: "Long-form writing, links, and cover images",
      },
      {
        id: "sidebar",
        label: "Sidebar Banners",
        icon: <ImageIcon className="h-4 w-4" />,
        hint: "Recent actions ads and promo banners",
      },
      {
        id: "projects",
        label: "Projects",
        icon: <LayoutDashboard className="h-4 w-4" />,
        hint: "Projects, links, images, categories",
      },
      {
        id: "experience",
        label: "Experience",
        icon: <LayoutDashboard className="h-4 w-4" />,
        hint: "Work entries + company images",
      },
      {
        id: "certs",
        label: "Certifications",
        icon: <KeyRound className="h-4 w-4" />,
        hint: "Licenses, verified toggles",
      },
      {
        id: "education",
        label: "Education",
        icon: <GraduationCap className="h-4 w-4" />,
        hint: "Degree, school, tags",
      },
    ],
    [],
  );

  const issues = useMemo(() => (content ? computeSectionIssues(content) : null), [content]);

  useEffect(() => {
    if (!autosave) return;
    if (!isDirty) return;
    if (!draft) return;
    if (saving || saveInFlightRef.current) return;

    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      void saveAll("autosave");
    }, 900);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosave, isDirty, draftSig, saving]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        void saveAll("shortcut");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, isDirty, draftSig]);

  if (me.isLoading) {
    return <div className="min-h-screen bg-background p-6 text-foreground">Loading…</div>;
  }

  if (!me.data?.isAdmin) return <Navigate to="/login" replace />;

  if (isLoading) {
    return <div className="min-h-screen bg-background p-6 text-foreground">Loading…</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        Failed to load admin content.
      </div>
    );
  }

  if (!content) return null;

  async function saveAll(reason: "manual" | "autosave" | "shortcut") {
    if (!content) return;
    if (saveInFlightRef.current) return;

    saveInFlightRef.current = true;
    setSaving(true);

    try {
      await apiFetch<{ ok: true }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify(content),
      });
      setLastSavedAt(Date.now());
      setDraft(null);
      toast({
        title: reason === "autosave" ? "Autosaved" : "Saved",
        description: "Your changes are now published.",
      });
      await refetch();
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      saveInFlightRef.current = false;
    }
  }

  async function onUpload(file: File, onUrl: (url: string) => void) {
    try {
      const { url } = await uploadImage(file);
      onUrl(
        url.startsWith("http")
          ? url
          : `${import.meta.env.VITE_API_BASE ?? "https://gad-backend-x1ky.onrender.com"}${url}`,
      );
      toast({ title: "Uploaded", description: "Image uploaded successfully." });
    } catch (e) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      });
    }
  }

  function resetToPublished() {
    setDraft(null);
    toast({ title: "Reset", description: "Draft cleared (back to published content)." });
  }

  function setContent(next: PortfolioContent) {
    setDraft(next);
  }

  function SidebarNav({ onNavigate }: { onNavigate: (id: AdminSectionId) => void }) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">Admin Studio</div>
                <div className="text-xs text-muted-foreground leading-tight">Content + media</div>
              </div>
            </div>
            <Badge variant={isDirty ? "destructive" : "secondary"} className="whitespace-nowrap">
              {isDirty ? "Unsaved" : "Synced"}
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => setPaletteOpen(true)}
            >
              Jump to…
              <span className="text-xs text-muted-foreground">Ctrl K</span>
            </Button>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Autosave</div>
              <Switch checked={autosave} onCheckedChange={setAutosave} />
            </div>
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="p-2">
            {sections.map((s) => {
              const issueCount = issues ? issues[s.id] : 0;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onNavigate(s.id)}
                  className={[
                    "w-full text-left rounded-xl px-3 py-2 transition-colors",
                  "hover:bg-[#0b3d91] hover:text-white",
                  isActive ? "bg-[#0b3d91] text-white" : "text-foreground",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{s.icon}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    {issueCount > 0 ? (
                      <Badge variant="secondary" className="ml-auto">
                        {issueCount}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="ml-auto">
                        OK
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={async () => {
              await logout().catch(() => {});
              window.location.href = "/";
            }}
          >
            <span className="inline-flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </span>
            <span className="text-xs text-muted-foreground">Session</span>
          </Button>

          <div className="text-xs text-muted-foreground">
            {lastSavedAt ? `Last saved ${new Date(lastSavedAt).toLocaleTimeString()}` : "Not saved yet"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Search sections & actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {sections.map((s) => (
              <CommandItem
                key={s.id}
                value={`nav-${s.id}-${s.label}`}
                onSelect={() => {
                  setActive(s.id);
                  setPaletteOpen(false);
                }}
              >
                <span className="mr-2 text-muted-foreground">{s.icon}</span>
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              value="save"
              onSelect={() => {
                setPaletteOpen(false);
                void saveAll("manual");
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save changes
              <CommandShortcut>Ctrl S</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="toggle-autosave"
              onSelect={() => {
                setAutosave((v) => !v);
                setPaletteOpen(false);
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Toggle autosave
              <CommandShortcut>A</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="preview"
              onSelect={() => {
                window.open("/", "_blank", "noopener,noreferrer");
                setPaletteOpen(false);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview site
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <div className="hidden md:block h-[calc(100vh-8.5rem)] sticky top-20">
          <Card className="h-full overflow-hidden">
            <SidebarNav onNavigate={(id) => setActive(id)} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="modern-card p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Autosave</div>
                  <Switch checked={autosave} onCheckedChange={setAutosave} />
                </div>
                <Badge variant={isDirty ? "destructive" : "secondary"}>
                  {isDirty ? "Unsaved" : "Synced"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={() => setPaletteOpen(true)}>
                  Search
                  <span className="ml-2 text-xs text-muted-foreground">Ctrl K</span>
                </Button>
                <Button variant="outline" onClick={resetToPublished} disabled={!isDirty}>
                  Undo
                </Button>
                <Button onClick={() => void saveAll("manual")} disabled={saving || !isDirty}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </Card>

          <Tabs value={active} onValueChange={(v) => setActive(v as AdminSectionId)}>
            <TabsList className="w-full flex flex-wrap justify-start h-auto gap-1">
              {sections.map((s) => (
                <TabsTrigger key={s.id} value={s.id} className="gap-2">
                  {s.icon}
                  <span>{s.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile">
              <ProfileEditor
                content={content}
                onChange={setContent}
                onUpload={onUpload}
              />
            </TabsContent>
            <TabsContent value="about">
              <AboutEditor content={content} onChange={setContent} />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="articles">
              <ArticlesEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="sidebar">
              <SidebarBannersEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="certs">
              <CertsEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
            <TabsContent value="education">
              <EducationEditor content={content} onChange={setContent} onUpload={onUpload} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  right,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <Card className="modern-card p-4 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </Card>
  );
}

function EditorItemList({
  items,
  selectedId,
  onSelect,
}: {
  items: Array<{ id: string; title: string; subtitle?: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              "w-full rounded-xl border px-3 py-2 text-left transition-colors",
              active
                ? "border-primary/40 bg-primary/10"
                : "border-border/60 bg-background/40 hover:bg-accent/20",
            ].join(" ")}
          >
            <div className="text-sm font-medium text-foreground truncate">
              {item.title}
            </div>
            {item.subtitle ? (
              <div className="mt-1 text-xs text-muted-foreground truncate">{item.subtitle}</div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ProfileEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Profile"
        description="Your public identity: name, title, links, and header images."
        right={
          <Badge variant="outline" className="inline-flex items-center gap-2">
            <ImageIcon className="h-3.5 w-3.5" />
            Media
          </Badge>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={content.profile.name}
              onChange={(e) =>
                onChange({
                  ...content,
                  profile: { ...content.profile, name: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={content.profile.location}
              onChange={(e) =>
                onChange({
                  ...content,
                  profile: { ...content.profile, location: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={content.profile.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  profile: { ...content.profile, title: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={content.profile.links.github}
              onChange={(e) =>
                onChange({
                  ...content,
                  profile: {
                    ...content.profile,
                    links: { ...content.profile.links, github: e.target.value },
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <Input
              value={content.profile.links.website ?? ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  profile: {
                    ...content.profile,
                    links: { ...content.profile.links, website: e.target.value },
                  },
                })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar URL</label>
            <div className="flex gap-2">
              <Input
                value={content.profile.avatarUrl}
                onChange={(e) =>
                  onChange({
                    ...content,
                    profile: { ...content.profile, avatarUrl: e.target.value },
                  })
                }
              />
              <label className="inline-flex">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const input = e.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    await onUpload(file, (url) =>
                      onChange({
                        ...content,
                        profile: { ...content.profile, avatarUrl: url },
                      }),
                    );
                    input.value = "";
                  }}
                />
                <Button asChild variant="secondary">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover URL</label>
            <div className="flex gap-2">
              <Input
                value={content.profile.coverUrl}
                onChange={(e) =>
                  onChange({
                    ...content,
                    profile: { ...content.profile, coverUrl: e.target.value },
                  })
                }
              />
              <label className="inline-flex">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const input = e.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    await onUpload(file, (url) =>
                      onChange({
                        ...content,
                        profile: { ...content.profile, coverUrl: url },
                      }),
                    );
                    input.value = "";
                  }}
                />
                <Button asChild variant="secondary">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Social icons</div>
              <div className="text-xs text-muted-foreground">
                These appear below your name in the header.
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                onChange({
                  ...content,
                  profile: {
                    ...content.profile,
                    socials: [
                      ...(content.profile.socials ?? []),
                      { id: uid(), platform: "LinkedIn", url: "" },
                    ],
                  },
                })
              }
            >
              Add social
            </Button>
          </div>

          <div className="space-y-2">
            {(content.profile.socials ?? []).map((social, idx) => (
              <div
                key={social.id}
                className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-2 items-end"
              >
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Platform</label>
                  <Input
                    value={social.platform}
                    onChange={(e) => {
                      const socials = [...(content.profile.socials ?? [])];
                      socials[idx] = { ...social, platform: e.target.value };
                      onChange({
                        ...content,
                        profile: { ...content.profile, socials },
                      });
                    }}
                    placeholder="LinkedIn / Email / Instagram / GitHub"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">URL</label>
                  <Input
                    value={social.url}
                    onChange={(e) => {
                      const socials = [...(content.profile.socials ?? [])];
                      socials[idx] = { ...social, url: e.target.value };
                      onChange({
                        ...content,
                        profile: { ...content.profile, socials },
                      });
                    }}
                    placeholder="https://… or mailto:…"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const socials = (content.profile.socials ?? []).filter((_, i) => i !== idx);
                    onChange({
                      ...content,
                      profile: { ...content.profile, socials },
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function AboutEditor({
  content,
  onChange,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
}) {
  return (
    <SectionCard title="About" description="A short story + punchy competencies list.">
      <Textarea
        value={content.about.text}
        onChange={(e) => onChange({ ...content, about: { ...content.about, text: e.target.value } })}
        rows={7}
        placeholder="Write your short bio…"
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Core competencies (comma separated)</label>
        <Input
          value={content.about.coreCompetencies.join(", ")}
          onChange={(e) =>
            onChange({
              ...content,
              about: {
                ...content.about,
                coreCompetencies: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              },
            })
          }
          placeholder="e.g. Product thinking, TypeScript, System design"
        />
      </div>
    </SectionCard>
  );
}

function ActivityEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  const items = content.activityPosts ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    setSelectedId((current) => (current && items.some((item) => item.id === current) ? current : (items[0]?.id ?? null)));
  }, [items]);

  const post = items.find((item) => item.id === selectedId) ?? null;
  const idx = post ? items.findIndex((item) => item.id === post.id) : -1;
  const postImages = post ? (post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : []) : [];

  return (
    <SectionCard
      title="Activity"
      description="Manage short posts, reorder your focus by selecting from the list, and attach one or more images."
      right={
        <Button
          variant="secondary"
          onClick={() => {
            const nextPost = {
              id: uid(),
              date: new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" }),
              content: "",
            };
            setSelectedId(nextPost.id);
            onChange({ ...content, activityPosts: [nextPost, ...items] });
          }}
        >
          Add post
        </Button>
      }
    >
      {!items.length ? (
        <div className="text-sm text-muted-foreground">
          No posts yet. Click <span className="font-medium text-foreground">Add post</span> to start.
        </div>
      ) : post ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <Card className="p-3 border-border/60 bg-background/40">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Posts</div>
                <div className="text-xs text-muted-foreground">{items.length} total</div>
              </div>
            </div>
            <div className="space-y-2">
              {items.map((item, itemIdx) => {
                const active = item.id === selectedId;
                const itemImages = item.imageUrls?.length
                  ? item.imageUrls
                  : item.imageUrl
                    ? [item.imageUrl]
                    : [];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={[
                      "w-full rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/60 bg-background hover:bg-accent/20",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
                        {itemImages[0] ? (
                          <img
                            src={itemImages[0]}
                            alt={`Post ${itemIdx + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">
                          {item.content.trim() ? item.content.trim().slice(0, 52) : `Post ${itemIdx + 1}`}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{item.date || "No date"}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {itemImages.length} {itemImages.length === 1 ? "image" : "images"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card key={post.id} className="p-4 space-y-4 border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Editing post {idx + 1}</div>
                <div className="text-xs text-muted-foreground">Update the date, text, and media for this post.</div>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  const nextItems = items.filter((p) => p.id !== post.id);
                  setSelectedId(nextItems[0]?.id ?? null);
                  onChange({ ...content, activityPosts: nextItems });
                }}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Date</label>
                    <Input
                      value={post.date}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...post, date: e.target.value };
                        onChange({ ...content, activityPosts: next });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Post</label>
                  <Textarea
                    value={post.content}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...post, content: e.target.value };
                      onChange({ ...content, activityPosts: next });
                    }}
                    rows={8}
                    placeholder="Write your post…"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs text-muted-foreground">Media</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const next = [...items];
                      const imageUrls = post.imageUrls?.length
                        ? [...post.imageUrls, ""]
                        : post.imageUrl
                          ? [post.imageUrl, ""]
                          : [""];
                      next[idx] = { ...post, imageUrls };
                      onChange({ ...content, activityPosts: next });
                    }}
                  >
                    Add image
                  </Button>
                </div>
                <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-3">
                  {postImages.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {postImages.map((imageUrl, imageIdx) => (
                        <div
                          key={`${post.id}-preview-${imageIdx}`}
                          className="aspect-square overflow-hidden rounded-lg border border-border/50 bg-muted"
                        >
                          <img
                            src={imageUrl}
                            alt={`Post preview ${imageIdx + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-xs text-muted-foreground">
                      No images attached yet.
                    </div>
                  )}

                  <div className="space-y-2">
                  {postImages.map((imageUrl, imageIdx) => (
                    <div key={`${post.id}-image-${imageIdx}`} className="flex gap-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => {
                          const next = [...content.activityPosts];
                          const imageUrls = post.imageUrls?.length
                            ? [...post.imageUrls]
                            : post.imageUrl
                              ? [post.imageUrl]
                              : [];
                          imageUrls[imageIdx] = e.target.value;
                          next[idx] = { ...post, imageUrls, imageUrl: imageUrls[0] ?? "" };
                          onChange({ ...content, activityPosts: next });
                        }}
                        placeholder="https://…"
                      />
                      <label className="inline-flex">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const input = e.currentTarget;
                            const file = input.files?.[0];
                            if (!file) return;
                            await onUpload(file, (url) => {
                              const next = [...items];
                              const imageUrls = post.imageUrls?.length
                                ? [...post.imageUrls]
                                : post.imageUrl
                                  ? [post.imageUrl]
                                  : [];
                              imageUrls[imageIdx] = url;
                              next[idx] = { ...post, imageUrls, imageUrl: imageUrls[0] ?? "" };
                              onChange({ ...content, activityPosts: next });
                            });
                            input.value = "";
                          }}
                        />
                        <Button asChild variant="secondary">
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </span>
                        </Button>
                      </label>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const next = [...content.activityPosts];
                          const imageUrls = (post.imageUrls?.length
                            ? post.imageUrls
                            : post.imageUrl
                              ? [post.imageUrl]
                              : []
                          ).filter((_, i) => i !== imageIdx);
                          next[idx] = { ...post, imageUrls, imageUrl: imageUrls[0] ?? "" };
                          onChange({ ...content, activityPosts: next });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="text-xs font-medium text-muted-foreground">Quick preview</div>
              <div className="mt-2 rounded-xl border border-border/50 bg-background p-3">
                <div className="text-[11px] text-muted-foreground">{post.date || "No date"}</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                  {post.content || "Your post preview will appear here."}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </SectionCard>
  );
}

function ArticlesEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  const items = content.articles ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    setSelectedId((current) => (current && items.some((item) => item.id === current) ? current : (items[0]?.id ?? null)));
  }, [items]);

  const article = items.find((item) => item.id === selectedId) ?? null;
  const idx = article ? items.findIndex((item) => item.id === article.id) : -1;

  return (
    <SectionCard
      title="Articles"
      description="Write long-form articles, add a cover image, and optionally link to the full published version."
      right={
        <Button
          variant="secondary"
          onClick={() => {
            const nextArticle = {
              id: uid(),
              title: "",
              date: new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" }),
              summary: "",
              content: "",
              imageUrl: "",
              imageAlt: "",
              link: "",
            };
            setSelectedId(nextArticle.id);
            onChange({ ...content, articles: [nextArticle, ...items] });
          }}
        >
          Add article
        </Button>
      }
    >
      {!items.length ? (
        <div className="text-sm text-muted-foreground">
          No articles yet. Click <span className="font-medium text-foreground">Add article</span> to start.
        </div>
      ) : article ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <EditorItemList
            items={items.map((item) => ({
              id: item.id,
              title: item.title.trim() || "Untitled article",
              subtitle: item.date,
            }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <Card key={article.id} className="p-4 space-y-3 border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Article {items.length - idx}</div>
              <Button
                variant="destructive"
                onClick={() => {
                  const nextItems = items.filter((entry) => entry.id !== article.id);
                  setSelectedId(nextItems[0]?.id ?? null);
                  onChange({ ...content, articles: nextItems });
                }}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Title</label>
                <Input
                  value={article.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...article, title: e.target.value };
                    onChange({ ...content, articles: next });
                  }}
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Date</label>
                <Input
                  value={article.date}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...article, date: e.target.value };
                    onChange({ ...content, articles: next });
                  }}
                  placeholder="Apr 2026"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Summary</label>
              <Textarea
                value={article.summary}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...article, summary: e.target.value };
                  onChange({ ...content, articles: next });
                }}
                rows={3}
                placeholder="A short introduction or teaser for the article…"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Article body</label>
              <Textarea
                value={article.content}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...article, content: e.target.value };
                  onChange({ ...content, articles: next });
                }}
                rows={8}
                placeholder="Write your full article here…"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Article link (optional)</label>
                <Input
                  value={article.link ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...article, link: e.target.value };
                    onChange({ ...content, articles: next });
                  }}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image alt (optional)</label>
                <Input
                  value={article.imageAlt ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...article, imageAlt: e.target.value };
                    onChange({ ...content, articles: next });
                  }}
                  placeholder="Describe the cover image"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Cover image (optional)</label>
              <div className="flex gap-2">
                <Input
                  value={article.imageUrl ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...article, imageUrl: e.target.value };
                    onChange({ ...content, articles: next });
                  }}
                  placeholder="https://… or /uploads/…"
                />
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const input = e.currentTarget;
                      const file = input.files?.[0];
                      if (!file) return;
                      await onUpload(file, (url) => {
                        const next = [...items];
                        next[idx] = { ...article, imageUrl: url };
                        onChange({ ...content, articles: next });
                      });
                      input.value = "";
                    }}
                  />
                  <Button asChild variant="secondary">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </SectionCard>
  );
}

function SidebarBannersEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  const items = content.sidebarBanners ?? [];

  return (
    <SectionCard
      title="Sidebar Banners"
      description="Use these as posting banners or small ads in the Recent Actions sidebar card."
      right={
        <Button
          variant="secondary"
          onClick={() =>
            onChange({
              ...content,
              sidebarBanners: [
                {
                  id: uid(),
                  link: "",
                  imageUrl: "",
                  imageAlt: "",
                },
                ...items,
              ],
            })
          }
        >
          Add banner
        </Button>
      }
    >
      <div className="space-y-4">
        {items.map((banner, idx) => (
          <Card key={banner.id} className="p-4 space-y-3 border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Banner {items.length - idx}</div>
              <Button
                variant="destructive"
                onClick={() =>
                  onChange({
                    ...content,
                    sidebarBanners: items.filter((b) => b.id !== banner.id),
                  })
                }
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Link (optional)</label>
                <Input
                  value={banner.link ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...banner, link: e.target.value };
                    onChange({ ...content, sidebarBanners: next });
                  }}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image alt (optional)</label>
                <Input
                  value={banner.imageAlt ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...banner, imageAlt: e.target.value };
                    onChange({ ...content, sidebarBanners: next });
                  }}
                  placeholder="Describe the banner image"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Banner image (optional)</label>
              <div className="flex gap-2">
                <Input
                  value={banner.imageUrl ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...banner, imageUrl: e.target.value };
                    onChange({ ...content, sidebarBanners: next });
                  }}
                  placeholder="https://… or /uploads/…"
                />
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const input = e.currentTarget;
                      const file = input.files?.[0];
                      if (!file) return;
                      await onUpload(file, (url) => {
                        const next = [...items];
                        next[idx] = { ...banner, imageUrl: url };
                        onChange({ ...content, sidebarBanners: next });
                      });
                      input.value = "";
                    }}
                  />
                  <Button asChild variant="secondary">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </Card>
        ))}

        {!items.length ? (
          <div className="text-sm text-muted-foreground">No sidebar banners yet.</div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function ExperienceEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  const items = content.experiences;
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setSelectedIdx((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length]);

  const exp = items[selectedIdx];

  return (
    <SectionCard
      title="Work Experience"
      description="Add experiences with optional industry and company image."
      right={
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedIdx(items.length);
            onChange({
              ...content,
              experiences: [
                ...items,
                {
                  role: "",
                  company: "",
                  industry: "",
                  companyImageUrl: "",
                  period: "",
                  location: "",
                  type: "Full-time",
                  description: "",
                },
              ],
            });
          }}
        >
          Add experience
        </Button>
      }
    >
      {!items.length ? (
        <div className="text-sm text-muted-foreground">
          No experiences yet. Click <span className="font-medium text-foreground">Add experience</span>.
        </div>
      ) : exp ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <EditorItemList
            items={items.map((item, index) => ({
              id: String(index),
              title: item.role || `Experience ${index + 1}`,
              subtitle: item.company || item.period || "No company yet",
            }))}
            selectedId={String(selectedIdx)}
            onSelect={(id) => setSelectedIdx(Number(id))}
          />

          <Card key={`${exp.company}-${selectedIdx}`} className="p-4 space-y-3 border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Experience {selectedIdx + 1}</div>
              <Button
                variant="destructive"
                onClick={() => {
                  const nextItems = items.filter((_, i) => i !== selectedIdx);
                  setSelectedIdx(Math.max(0, selectedIdx - 1));
                  onChange({ ...content, experiences: nextItems });
                }}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Role</label>
                <Input
                  value={exp.role}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, role: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Company</label>
                <Input
                  value={exp.company}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, company: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Industry (optional)</label>
                <Input
                  value={exp.industry ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, industry: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                  placeholder="e.g. Logistics, Fintech…"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Location</label>
                <Input
                  value={exp.location}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, location: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Period</label>
                <Input
                  value={exp.period}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, period: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                  placeholder="e.g. Dec 2023 – Present"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Type</label>
                <Input
                  value={exp.type}
                  onChange={(e) => {
                    const next = [...items];
                    next[selectedIdx] = { ...exp, type: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                  placeholder="Full-time / Contract / Freelance…"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea
                value={exp.description}
                onChange={(e) => {
                  const next = [...items];
                  next[selectedIdx] = { ...exp, description: e.target.value };
                  onChange({ ...content, experiences: next });
                }}
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Company image (optional)</label>
              <div className="flex gap-2">
                <Input
                  value={exp.companyImageUrl ?? ""}
                  onChange={(e) => {
                    const next = [...content.experiences];
                    next[idx] = { ...exp, companyImageUrl: e.target.value };
                    onChange({ ...content, experiences: next });
                  }}
                  placeholder="https://…"
                />
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const input = e.currentTarget;
                      const file = input.files?.[0];
                      if (!file) return;
                      await onUpload(file, (url) => {
                        const next = [...items];
                        next[selectedIdx] = { ...exp, companyImageUrl: url };
                        onChange({ ...content, experiences: next });
                      });
                      input.value = "";
                    }}
                  />
                  <Button asChild variant="secondary">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </SectionCard>
  );
}

function ProjectsEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  const items = content.projects ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    setSelectedId((current) => (current && items.some((item) => item.id === current) ? current : (items[0]?.id ?? null)));
  }, [items]);

  const p = items.find((item) => item.id === selectedId) ?? null;
  const idx = p ? items.findIndex((item) => item.id === p.id) : -1;

  function addProject() {
    const nextProject = {
      id: uid(),
      title: "",
      category: "Individual" as const,
      summary: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
      links: [{ label: "Live", url: "" }],
      tech: [],
      featured: false,
    };
    setSelectedId(nextProject.id);
    onChange({ ...content, projects: [nextProject, ...items] });
  }

  return (
    <SectionCard
      title="Projects"
      description="Add projects with image, links, category (individual/team/etc), and tech tags."
      right={
        <Button variant="secondary" onClick={addProject} className="gap-2">
          <Plus className="h-4 w-4" />
          Add project
        </Button>
      }
    >
      {!items.length ? (
        <div className="text-sm text-muted-foreground">
          No projects yet. Click <span className="font-medium text-foreground">Add project</span>.
        </div>
      ) : p ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <EditorItemList
            items={items.map((item) => ({
              id: item.id,
              title: item.title || "Untitled project",
              subtitle: item.category,
            }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <Card key={p.id} className="p-4 space-y-3 border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Project {items.length - idx}</div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(p.featured)}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...p, featured: e.target.checked };
                      onChange({ ...content, projects: next });
                    }}
                  />
                  Featured
                </label>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const nextItems = items.filter((x) => x.id !== p.id);
                    setSelectedId(nextItems[0]?.id ?? null);
                    onChange({ ...content, projects: nextItems });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Title</label>
                <Input
                  value={p.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...p, title: e.target.value };
                    onChange({ ...content, projects: next });
                  }}
                  placeholder="Project name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Category</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={p.category}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...p, category: e.target.value as typeof p.category };
                    onChange({ ...content, projects: next });
                  }}
                >
                  <option value="Individual">Individual</option>
                  <option value="Team">Team</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Client">Client</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Summary</label>
              <Textarea
                value={p.summary}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...p, summary: e.target.value };
                  onChange({ ...content, projects: next });
                }}
                rows={2}
                placeholder="1–2 lines describing the project"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Description (optional)</label>
              <Textarea
                value={p.description ?? ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...p, description: e.target.value };
                  onChange({ ...content, projects: next });
                }}
                rows={3}
                placeholder="More details (optional)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image URL (optional)</label>
                <div className="flex gap-2">
                  <Input
                    value={p.imageUrl ?? ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...p, imageUrl: e.target.value };
                      onChange({ ...content, projects: next });
                    }}
                    placeholder="https://… or /uploads/…"
                  />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const input = e.currentTarget;
                        const file = input.files?.[0];
                        if (!file) return;
                        await onUpload(file, (url) => {
                          const next = [...items];
                          next[idx] = { ...p, imageUrl: url };
                          onChange({ ...content, projects: next });
                        });
                        input.value = "";
                      }}
                    />
                    <Button asChild variant="secondary">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image alt (optional)</label>
                <Input
                  value={p.imageAlt ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...p, imageAlt: e.target.value };
                    onChange({ ...content, projects: next });
                  }}
                  placeholder="Describe the image"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs text-muted-foreground">Links</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = [...items];
                    const links = [...(p.links ?? [])];
                    links.push({ label: "Link", url: "" });
                    next[idx] = { ...p, links };
                    onChange({ ...content, projects: next });
                  }}
                >
                  Add link
                </Button>
              </div>

              <div className="space-y-2">
                {(p.links ?? []).map((l, linkIdx) => (
                  <div
                    key={`${p.id}-link-${linkIdx}`}
                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-2 items-end"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Label</label>
                      <Input
                        value={l.label}
                        onChange={(e) => {
                          const next = [...items];
                          const links = [...(p.links ?? [])];
                          links[linkIdx] = { ...l, label: e.target.value };
                          next[idx] = { ...p, links };
                          onChange({ ...content, projects: next });
                        }}
                        placeholder="Live / GitHub / Demo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">URL</label>
                      <Input
                        value={l.url}
                        onChange={(e) => {
                          const next = [...items];
                          const links = [...(p.links ?? [])];
                          links[linkIdx] = { ...l, url: e.target.value };
                          next[idx] = { ...p, links };
                          onChange({ ...content, projects: next });
                        }}
                        placeholder="https://…"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const next = [...items];
                        const links = (p.links ?? []).filter((_, i) => i !== linkIdx);
                        next[idx] = { ...p, links };
                        onChange({ ...content, projects: next });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Tech (comma separated)</label>
              <Input
                value={(p.tech ?? []).join(", ")}
                onChange={(e) => {
                  const tech = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const next = [...items];
                  next[idx] = { ...p, tech };
                  onChange({ ...content, projects: next });
                }}
                placeholder="React, TypeScript, Node, MongoDB…"
              />
            </div>
          </Card>
        </div>
      ) : null}
    </SectionCard>
  );
}

function SkillsEditor({
  content,
  onChange,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
}) {
  return (
    <SectionCard
      title="Technical Skills"
      description="Add skills with a percentage. Color uses Tailwind gradient classes."
      right={
        <Button
          variant="secondary"
          onClick={() =>
            onChange({
              ...content,
              skills: [...content.skills, { name: "", level: 50, color: "from-sky-500 to-sky-600" }],
            })
          }
        >
          Add skill
        </Button>
      }
    >
      <div className="space-y-3">
        {content.skills.map((skill, idx) => (
          <Card key={`${skill.name}-${idx}`} className="p-4 border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_220px_auto] gap-2 items-end">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Skill</label>
                <Input
                  value={skill.name}
                  onChange={(e) => {
                    const next = [...content.skills];
                    next[idx] = { ...skill, name: e.target.value };
                    onChange({ ...content, skills: next });
                  }}
                  placeholder="e.g. React"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Percentage</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={(e) => {
                    const next = [...content.skills];
                    const level = Math.max(0, Math.min(100, Number(e.target.value || 0)));
                    next[idx] = { ...skill, level };
                    onChange({ ...content, skills: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Bar color</label>
                <Input
                  value={skill.color}
                  onChange={(e) => {
                    const next = [...content.skills];
                    next[idx] = { ...skill, color: e.target.value };
                    onChange({ ...content, skills: next });
                  }}
                  placeholder="from-… to-…"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => onChange({ ...content, skills: content.skills.filter((_, i) => i !== idx) })}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function CertsEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  return (
    <SectionCard
      title="Licenses & Certifications"
      description="Add certifications and toggle verified."
      right={
        <Button
          variant="secondary"
          onClick={() =>
            onChange({
              ...content,
              certifications: [
                ...content.certifications,
                {
                  title: "",
                  issuer: "",
                  date: "",
                  type: "Development",
                  verified: true,
                  imageUrl: "",
                  imageAlt: "",
                  link: "",
                },
              ],
            })
          }
        >
          Add certification
        </Button>
      }
    >
      <div className="space-y-3">
        {content.certifications.map((cert, idx) => (
          <Card key={`${cert.title}-${idx}`} className="p-4 space-y-3 border-border/60">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Certification {idx + 1}</div>
              <Button
                variant="destructive"
                onClick={() =>
                  onChange({
                    ...content,
                    certifications: content.certifications.filter((_, i) => i !== idx),
                  })
                }
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Title</label>
                <Input
                  value={cert.title}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, title: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Issuer</label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, issuer: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Date</label>
                <Input
                  value={cert.date}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, date: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                  placeholder="e.g. Nov 2024"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Type</label>
                <Input
                  value={cert.type}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, type: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                  placeholder="Development / Design / …"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Certificate link (optional)</label>
                <Input
                  value={cert.link ?? ""}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, link: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image alt (optional)</label>
                <Input
                  value={cert.imageAlt ?? ""}
                  onChange={(e) => {
                    const next = [...content.certifications];
                    next[idx] = { ...cert, imageAlt: e.target.value };
                    onChange({ ...content, certifications: next });
                  }}
                  placeholder="Describe the certificate image"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Certificate image (optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
                  <Input
                    value={cert.imageUrl ?? ""}
                    onChange={(e) => {
                      const next = [...content.certifications];
                      next[idx] = { ...cert, imageUrl: e.target.value };
                      onChange({ ...content, certifications: next });
                    }}
                    placeholder="Paste image URL, or upload an image…"
                  />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const input = e.currentTarget;
                        const file = input.files?.[0];
                        if (!file) return;
                        await onUpload(file, (url) => {
                          const next = [...content.certifications];
                          next[idx] = { ...cert, imageUrl: url };
                          onChange({ ...content, certifications: next });
                        });
                        input.value = "";
                      }}
                    />
                    <Button asChild variant="secondary">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </span>
                    </Button>
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const next = [...content.certifications];
                      next[idx] = { ...cert, imageUrl: "" };
                      onChange({ ...content, certifications: next });
                    }}
                    disabled={!String(cert.imageUrl ?? "").trim()}
                  >
                    Clear
                  </Button>
                </div>

                {String(cert.imageUrl ?? "").trim() ? (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-[11px] text-muted-foreground">Preview</div>
                    <div className="rounded-lg overflow-hidden border border-border/60 bg-muted w-20 aspect-[4/5]">
                      <img
                        src={cert.imageUrl as string}
                        alt={cert.imageAlt ?? "Certificate preview"}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id={`verified-${idx}`}
                type="checkbox"
                checked={cert.verified}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[idx] = { ...cert, verified: e.target.checked };
                  onChange({ ...content, certifications: next });
                }}
              />
              <label htmlFor={`verified-${idx}`} className="text-sm">
                Verified
              </label>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function EducationEditor({
  content,
  onChange,
  onUpload,
}: {
  content: PortfolioContent;
  onChange: (next: PortfolioContent) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => void;
}) {
  return (
    <SectionCard
      title="Education"
      description="Keep it concise; tags help scanning."
      right={
        <Button
          variant="destructive"
          onClick={() =>
            onChange({
              ...content,
              education: {
                degree: "",
                school: "",
                period: "",
                summary: "",
                tags: [],
                imageUrl: "",
              },
            })
          }
        >
          Delete
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <EditorItemList
          items={[
            {
              id: "education",
              title: content.education.school || "Education",
              subtitle: content.education.degree || "No degree yet",
            },
          ]}
          selectedId="education"
          onSelect={() => {}}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Degree</label>
          <Input
            value={content.education.degree}
            onChange={(e) =>
              onChange({ ...content, education: { ...content.education, degree: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">School</label>
          <Input
            value={content.education.school}
            onChange={(e) =>
              onChange({ ...content, education: { ...content.education, school: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Period</label>
          <Input
            value={content.education.period}
            onChange={(e) =>
              onChange({ ...content, education: { ...content.education, period: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">University image (optional)</label>
          <div className="flex gap-2">
            <Input
              value={content.education.imageUrl ?? ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  education: { ...content.education, imageUrl: e.target.value },
                })
              }
              placeholder="https://… or /uploads/…"
            />
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const input = e.currentTarget;
                  const file = input.files?.[0];
                  if (!file) return;
                  await onUpload(file, (url) =>
                    onChange({
                      ...content,
                      education: { ...content.education, imageUrl: url },
                    }),
                  );
                  input.value = "";
                }}
              />
              <Button asChild variant="secondary">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </span>
              </Button>
            </label>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Tags (comma separated)</label>
          <Input
            value={content.education.tags.join(", ")}
            onChange={(e) =>
              onChange({
                ...content,
                education: {
                  ...content.education,
                  tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                },
              })
            }
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs text-muted-foreground">Summary</label>
          <Textarea
            value={content.education.summary}
            onChange={(e) =>
              onChange({ ...content, education: { ...content.education, summary: e.target.value } })
            }
            rows={5}
          />
        </div>
        {String(content.education.imageUrl ?? "").trim() ? (
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-muted-foreground">Preview</label>
            <div className="rounded-lg overflow-hidden border border-border/60 bg-muted w-16 h-16">
              <img
                src={content.education.imageUrl}
                alt={content.education.school || "University preview"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : null}
        </div>
      </div>
    </SectionCard>
  );
}

