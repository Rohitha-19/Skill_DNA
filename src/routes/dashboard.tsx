import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Users } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DNAReport } from "@/components/dna-report";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/session";
import {
  careerReadiness,
  hiringRecommendation,
  overallScore,
  readinessLevel,
} from "@/lib/scoring";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Recruiter Dashboard — Skill DNA" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { all } = useSession();
  const [activeId, setActiveId] = useState<string | null>(null);
  const ranked = [...all].sort((a, b) => overallScore(b.answers) - overallScore(a.answers));
  const active = ranked.find((s) => s.candidate.id === activeId) ?? ranked[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Runtime Session</div>
            <h1 className="text-4xl font-bold tracking-tight">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">{ranked.length} candidate{ranked.length === 1 ? "" : "s"} this session.</p>
          </div>
          <Link to="/register">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">Add Candidate</Button>
          </Link>
        </div>

        {ranked.length === 0 ? (
          <Card className="glass border-border/40 p-16 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No candidates yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Complete an assessment to populate the dashboard.</p>
            <Link to="/register"><Button className="mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90">Start First Assessment</Button></Link>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold"><Trophy className="h-4 w-4 text-accent" /> Session Leaderboard</h3>
              {ranked.map((s, i) => {
                const o = overallScore(s.answers);
                const isActive = (active?.candidate.id === s.candidate.id);
                return (
                  <button
                    key={s.candidate.id}
                    onClick={() => setActiveId(s.candidate.id)}
                    className={["w-full rounded-xl border p-4 text-left transition", isActive ? "border-primary bg-primary/10 shadow-glow" : "border-border/40 glass hover:border-primary/40"].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                        <div>
                          <div className="text-sm font-semibold">{s.candidate.fullName}</div>
                          <div className="text-[10px] text-muted-foreground">{s.candidate.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold gradient-text">{o}</div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{readinessLevel(careerReadiness(s.answers))}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-[10px]">{hiringRecommendation(o)}</Badge>
                  </button>
                );
              })}
            </div>
            <div>
              {active && <DNAReport session={active} />}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}