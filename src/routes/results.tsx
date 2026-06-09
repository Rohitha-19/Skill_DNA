import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DNAReport } from "@/components/dna-report";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Skill DNA Report" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { current } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!current || !current.completedAt) navigate({ to: "/register" });
  }, [current, navigate]);

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Assessment Complete</div>
            <h1 className="text-3xl font-bold gradient-text">Digital Skill DNA Report</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard"><Button variant="outline">Recruiter View</Button></Link>
            <Link to="/register"><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">New Candidate</Button></Link>
          </div>
        </div>
        <DNAReport session={current} />
      </main>
      <SiteFooter />
    </div>
  );
}