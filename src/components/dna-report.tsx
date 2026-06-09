import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  FileText,
  Gauge,
  Lightbulb,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CandidateSession } from "@/lib/session";
import {
  accuracyScore,
  badges,
  careerReadiness,
  confidenceIndex,
  decisionStyle,
  efficiencyScore,
  focusStability,
  hiringRecommendation,
  interviewReadiness,
  overallScore,
  readinessLevel,
  roleMatches,
  sectionScores,
  skillDNA,
  speedScore,
  topImprovements,
  topStrengths,
  analyzeResume,
} from "@/lib/scoring";
import { SECTION_META } from "@/lib/questions";

const COLORS = ["oklch(0.55 0.22 265)", "oklch(0.72 0.18 175)", "oklch(0.7 0.2 50)", "oklch(0.65 0.22 330)", "oklch(0.78 0.18 130)"];

export function DNAReport({ session }: { session: CandidateSession }) {
  const dna = useMemo(() => skillDNA(session.answers), [session]);
  const sections = useMemo(() => sectionScores(session.answers), [session]);
  const overall = overallScore(session.answers);
  const readiness = careerReadiness(session.answers);
  const interview = interviewReadiness(session.answers);
  const recommend = hiringRecommendation(overall);
  const level = readinessLevel(readiness);
  const strengths = topStrengths(dna);
  const improvements = topImprovements(dna);
  const badgeList = badges(session);
  const roles = roleMatches(dna, session.candidate.skills);

  const radarData = [
    { metric: "Technical", value: dna.technical },
    { metric: "Problem Solving", value: dna.problemSolving },
    { metric: "Logical", value: dna.logical },
    { metric: "Learning", value: dna.learningAgility },
    { metric: "Communication", value: dna.communication },
    { metric: "Consistency", value: dna.consistency },
    { metric: "Speed", value: dna.decisionSpeed },
    { metric: "Accuracy", value: dna.accuracyPressure },
  ];

  const sectionBar = sections.map((s) => ({
    section: SECTION_META[s.section as keyof typeof SECTION_META].title,
    score: s.percentage,
  }));

  const timeline = session.answers.map((a, i) => ({
    q: i + 1,
    time: +(a.timeMs / 1000).toFixed(1),
    correct: a.correct ? 1 : 0,
  }));

  const pieData = sections.map((s) => ({
    name: SECTION_META[s.section as keyof typeof SECTION_META].title,
    value: s.correct,
  }));

  return (
    <div className="space-y-6">
      {/* Candidate header */}
      <Card className="glass border-border/40 p-6 shadow-elegant">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Candidate {session.candidate.id}</div>
            <h1 className="text-3xl font-bold">{session.candidate.fullName}</h1>
            <p className="text-sm text-muted-foreground">{session.candidate.email} · {session.candidate.degree} · {session.candidate.department}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {session.candidate.skills.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Hiring Recommendation</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              <CheckCircle2 className="h-4 w-4" /> {recommend}
            </div>
          </div>
        </div>
      </Card>

      {/* Big scores */}
      <div className="grid gap-4 md:grid-cols-4">
        <ScoreRing label="Overall" value={overall} icon={Brain} />
        <ScoreRing label="Career Readiness" value={readiness} icon={Gauge} sub={level} />
        <ScoreRing label="Interview Ready" value={interview} icon={Briefcase} />
        <ScoreRing label="Skill DNA Score" value={Math.round((overall + readiness) / 2)} icon={Award} sub={decisionStyle(session.answers) + " Decider"} />
      </div>

      <Tabs defaultValue="dna" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="dna">Skill DNA</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="roles">Role Match</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="dna" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="glass border-border/40 p-6 lg:col-span-2">
              <h3 className="font-semibold">Competency Radar</h3>
              <p className="mb-2 text-xs text-muted-foreground">Your unique Digital Skill DNA fingerprint</p>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="oklch(0.55 0.22 265)" fill="oklch(0.55 0.22 265)" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="glass border-border/40 p-6">
              <h3 className="font-semibold">Strength Matrix</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {radarData.map((r) => (
                  <div key={r.metric} className="rounded-lg border border-border/40 bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.metric}</div>
                    <div className="mt-1 text-xl font-bold">{r.value}%</div>
                    <div className="mt-1 h-1 rounded bg-secondary">
                      <div className="h-full rounded bg-gradient-primary" style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass border-border/40 p-6">
              <h3 className="flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-accent" /> Top 5 Strengths</h3>
              <ul className="mt-4 space-y-3">
                {strengths.map((s) => (
                  <li key={s.label}>
                    <div className="flex items-center justify-between text-sm"><span>{s.label}</span><span className="font-semibold">{s.value}%</span></div>
                    <div className="mt-1 h-1.5 rounded bg-secondary"><div className="h-full rounded bg-gradient-accent" style={{ width: `${s.value}%` }} /></div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="glass border-border/40 p-6">
              <h3 className="flex items-center gap-2 font-semibold"><Target className="h-4 w-4 text-primary" /> Top 5 Improvement Areas</h3>
              <ul className="mt-4 space-y-3">
                {improvements.map((s) => (
                  <li key={s.label}>
                    <div className="flex items-center justify-between text-sm"><span>{s.label}</span><span className="font-semibold">{s.value}%</span></div>
                    <div className="mt-1 h-1.5 rounded bg-secondary"><div className="h-full rounded bg-primary" style={{ width: `${Math.max(s.value, 5)}%` }} /></div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="glass border-border/40 p-6">
            <h3 className="flex items-center gap-2 font-semibold"><Award className="h-4 w-4 text-accent" /> Achievement Badges</h3>
            {badgeList.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No badges earned this run.</p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {badgeList.map((b) => (
                  <div key={b.name} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary"><Award className="h-5 w-5 text-primary-foreground" /></div>
                    <div>
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.tier} Tier</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass border-border/40 p-6">
              <h3 className="font-semibold">Section Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionBar}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="section" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="score" fill="oklch(0.55 0.22 265)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="glass border-border/40 p-6">
              <h3 className="font-semibold">Correct Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card className="glass border-border/40 p-6">
            <h3 className="font-semibold">Performance Timeline</h3>
            <p className="text-xs text-muted-foreground">Time spent per question (seconds)</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeline}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="q" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="time" stroke="oklch(0.72 0.18 175)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((r) => (
              <Card key={r.role} className="glass border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{r.role}</h3>
                  <div className={`text-2xl font-bold ${r.match >= 70 ? "text-accent" : r.match >= 50 ? "text-primary" : "text-muted-foreground"}`}>{r.match}%</div>
                </div>
                <div className="mt-2 h-2 rounded bg-secondary">
                  <div className="h-full rounded bg-gradient-primary" style={{ width: `${r.match}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{r.reason}</p>
                {r.missing.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Skill gaps</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.missing.map((m) => (
                        <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Insight icon={Zap} label="Speed Score" value={speedScore(session.answers)} />
            <Insight icon={Target} label="Accuracy" value={accuracyScore(session.answers)} />
            <Insight icon={Gauge} label="Efficiency" value={efficiencyScore(session.answers)} />
            <Insight icon={Brain} label="Confidence Index" value={confidenceIndex(session.answers)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass border-border/40 p-6">
              <h3 className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-accent" /> Personalized Learning Roadmap</h3>
              <ol className="mt-4 space-y-3">
                {improvements.map((imp, i) => (
                  <li key={imp.label} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                    <div>
                      <div className="text-sm font-semibold">Strengthen {imp.label}</div>
                      <div className="text-xs text-muted-foreground">Practice targeted exercises and projects. Current: {imp.value}%.</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <Card className="glass border-border/40 p-6">
              <h3 className="font-semibold">Behavioral Profile</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Decision Style</span><span className="font-semibold">{decisionStyle(session.answers)}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Focus Stability</span><span className="font-semibold">{focusStability(session.answers)}%</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Readiness Level</span><span className="font-semibold">{level}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Career Interest</span><span className="font-semibold">{session.candidate.careerInterest}</span></li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resume" className="mt-6">
          <ResumeAnalyzer session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreRing({ label, value, icon: Icon, sub }: { label: string; value: number; icon: any; sub?: string }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <Card className="glass border-border/40 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-3xl font-bold gradient-text">{value}</div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r={r} stroke="var(--secondary)" strokeWidth="6" fill="none" />
            <circle
              cx="40" cy="40" r={r}
              stroke="oklch(0.72 0.18 175)" strokeWidth="6" fill="none"
              strokeDasharray={c}
              strokeDashoffset={c - (value / 100) * c}
              strokeLinecap="round"
            />
          </svg>
          <Icon className="absolute inset-0 m-auto h-6 w-6 text-accent" />
        </div>
      </div>
    </Card>
  );
}

function Insight({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card className="glass border-border/40 p-5">
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-3 text-2xl font-bold">{value}%</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}

function ResumeAnalyzer({ session }: { session: CandidateSession }) {
  const [text, setText] = useState(session.resumeText ?? "");
  const [result, setResult] = useState<ReturnType<typeof analyzeResume> | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const t = await f.text();
    setText(t);
  };

  const analyze = () => {
    setResult(analyzeResume(text, session.candidate.skills));
  };

  return (
    <Card className="glass border-border/40 p-6">
      <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-accent" /> Resume Strength Analyzer</h3>
      <p className="mt-1 text-sm text-muted-foreground">Upload a text-based resume (.txt) or paste content below.</p>
      <div className="mt-4 flex gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-secondary">
          <Upload className="h-4 w-4" /> Upload .txt
          <input type="file" accept=".txt,text/plain" className="hidden" onChange={handleFile} />
        </label>
        <Button onClick={analyze} disabled={!text} className="bg-gradient-primary text-primary-foreground hover:opacity-90">Analyze</Button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste resume text here..."
        className="mt-4 h-40 w-full rounded-md border border-border bg-background p-3 text-sm"
      />
      {result && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Resume Strength</div>
            <div className="mt-2 text-4xl font-bold gradient-text">{result.score}</div>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Skills Found</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {result.skillsFound.length ? result.skillsFound.map((s) => <Badge key={s} variant="secondary">{s}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
            </div>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Recommended to add</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {result.missing.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}