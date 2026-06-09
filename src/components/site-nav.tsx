import { Link } from "@tanstack/react-router";
import { Brain, Moon, Sun } from "lucide-react";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  const { theme, toggleTheme, current, all } = useSession();
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight">Skill DNA</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Competency Intelligence</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" activeOptions={{ exact: true }} className="text-sm font-medium text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/register" className="text-sm font-medium text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Assessment</Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Recruiter ({all.length})</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {current ? (
            <Link to="/assessment">
              <Button size="sm" variant="secondary">Resume</Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">Start</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Skill DNA</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Recruitment intelligence powered by candidate Digital Skill DNA profiles.</p>
        </div>
        <div>
          <h4 className="font-semibold">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Assessments</li>
            <li>Skill DNA Report</li>
            <li>Recruiter Dashboard</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">For Recruiters</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Competency Analytics</li>
            <li>Hiring Recommendations</li>
            <li>Role Matching</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">For Candidates</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Career Readiness</li>
            <li>Learning Roadmap</li>
            <li>Skill Badges</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">© 2026 Skill DNA Intelligence. Runtime session demo.</div>
    </footer>
  );
}