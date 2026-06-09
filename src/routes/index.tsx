import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Brain, Sparkles, Target, Zap, Trophy, Users, TrendingUp, ShieldCheck, Rocket, BarChart3, Cpu, FileSearch } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill DNA — Competency Intelligence Platform" },
      { name: "description", content: "Evaluate candidates with adaptive assessments and generate a unique Digital Skill DNA profile, career readiness score, and hiring recommendations." },
      { property: "og:title", content: "Skill DNA — Competency Intelligence Platform" },
      { property: "og:description", content: "Adaptive assessments. Digital Skill DNA. Hiring recommendations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <Stats />
        <DNAFeature />
        <Features />
        <Workflow />
        <Benefits />
        <FAQ />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_20%,oklch(0.7_0.2_280/0.25),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.72_0.18_175/0.2),transparent_50%)]" />
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Powered by Digital Skill DNA Analysis
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Decode every candidate's <span className="gradient-text">Skill DNA</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A recruitment intelligence platform that goes beyond scores. Generate competency fingerprints, career readiness meters, and role-match analytics in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 h-12 px-8">
                <Rocket className="mr-2 h-4 w-4" /> Start Assessment
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="h-12 px-8 glass">
                Recruiter Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Adaptive Difficulty", "Real-time Analytics", "Skill DNA Reports", "Role Matching"].map((f) => (
              <div key={f} className="glass rounded-xl p-4 text-sm font-medium">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "10+", l: "Competencies Analyzed" },
    { v: "5", l: "Assessment Sections" },
    { v: "9", l: "Role Recommendations" },
    { v: "100%", l: "Runtime Session" },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((i) => (
          <Card key={i.l} className="glass border-border/40 p-6 text-center">
            <div className="text-3xl font-bold gradient-text md:text-4xl">{i.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{i.l}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DNAFeature() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Brain className="h-3.5 w-3.5" /> Flagship Feature
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            The Digital Skill DNA Report
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every candidate receives a unique competency fingerprint—visualized as a radar, strength matrix, and career readiness gauge. No two profiles are alike.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Skill DNA Chart & Competency Radar",
              "Top 5 Strengths & Improvement Areas",
              "Personalized Learning Roadmap",
              "Best-Fit Job Role Matching",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground">✓</div>
                <span className="text-sm">{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="glass border-border/40 p-8 shadow-elegant">
          <div className="grid grid-cols-2 gap-4">
            {[
              { i: Brain, l: "Technical", v: 87 },
              { i: Target, l: "Problem Solving", v: 79 },
              { i: Cpu, l: "Logical", v: 92 },
              { i: Zap, l: "Speed", v: 74 },
              { i: ShieldCheck, l: "Accuracy", v: 88 },
              { i: TrendingUp, l: "Learning Agility", v: 81 },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border/40 bg-background/40 p-4">
                <s.i className="h-5 w-5 text-accent" />
                <div className="mt-3 text-2xl font-bold">{s.v}%</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { i: Brain, t: "Adaptive Difficulty", d: "Difficulty adjusts in real time based on candidate performance." },
    { i: BarChart3, t: "Interactive Analytics", d: "Radar, gauges, progress rings, and skill matrix visualizations." },
    { i: Target, t: "Confidence Index", d: "Compares stated confidence with actual accuracy per question." },
    { i: Zap, t: "Time Intelligence", d: "Speed, accuracy, and efficiency tracked per question." },
    { i: FileSearch, t: "Resume Analyzer", d: "Upload a resume to evaluate skill coverage and gaps." },
    { i: Trophy, t: "Gamified Badges", d: "Bronze to Elite competency tiers with achievement badges." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Built for hiring intelligence</h2>
        <p className="mt-3 text-muted-foreground">Everything recruiters need to evaluate candidates beyond a number.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.t} className="glass border-border/40 p-6 transition hover:shadow-elegant">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <f.i className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: "01", t: "Register", d: "Candidate enters basic profile and skills." },
    { n: "02", t: "Assess", d: "5 adaptive sections with confidence ratings." },
    { n: "03", t: "Analyze", d: "Engine computes Skill DNA & readiness score." },
    { n: "04", t: "Decide", d: "Recruiter sees hiring recommendation & role fit." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Assessment workflow</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative">
            <Card className="glass border-border/40 p-6 h-full">
              <div className="text-3xl font-bold gradient-text">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </Card>
            {i < steps.length - 1 && (
              <div className="absolute right-[-12px] top-1/2 hidden h-px w-6 bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/40 p-8">
          <Users className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-2xl font-bold">For Recruiters</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Faster, data-driven hiring decisions</li>
            <li>• Compare candidates side-by-side</li>
            <li>• Role match percentages with reasoning</li>
            <li>• Interview readiness and hiring suitability scores</li>
          </ul>
        </Card>
        <Card className="glass border-border/40 p-8">
          <Rocket className="h-8 w-8 text-accent" />
          <h3 className="mt-4 text-2xl font-bold">For Candidates</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Personalized Skill DNA profile</li>
            <li>• Career roadmap and learning priorities</li>
            <li>• Discover best-fit job roles</li>
            <li>• Gamified badges and competency tiers</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "What is the Digital Skill DNA Report?", a: "A unique competency fingerprint per candidate, visualizing 8 dimensions including technical, problem solving, accuracy under pressure, and decision speed." },
    { q: "How does adaptive difficulty work?", a: "Each correct answer raises difficulty; each wrong answer lowers it. The path through Easy → Medium → Hard is unique per candidate." },
    { q: "Is candidate data stored permanently?", a: "No. This is a runtime session demo—data persists only while your browser tab is open." },
    { q: "How are role matches calculated?", a: "Weighted scoring across competencies determines fit per role; missing skills produce a learning roadmap." },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">Frequently asked</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="glass rounded-xl border-border/40 px-5">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="relative overflow-hidden border-border/40 p-12 text-center shadow-elegant">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="relative">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Ready to decode talent?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Run your first Skill DNA assessment in minutes.</p>
          <Link to="/register">
            <Button size="lg" className="mt-8 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 h-12 px-8">
              Start Assessment <Rocket className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
