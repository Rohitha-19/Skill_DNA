import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, Clock, Trophy } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  pickQuestion,
  SECTION_META,
  SECTION_ORDER,
  type Question,
} from "@/lib/questions";
import { useSession, type Confidence, type Difficulty, type Section } from "@/lib/session";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [{ title: "Assessment — Skill DNA" }] }),
  component: AssessmentPage,
});

const QUESTIONS_PER_SECTION = 5;
const CONFIDENCE: Confidence[] = ["Very High", "High", "Medium", "Low"];

function nextDifficulty(d: Difficulty, correct: boolean): Difficulty {
  if (correct) return d === "Easy" ? "Medium" : d === "Medium" ? "Hard" : "Hard";
  return d === "Hard" ? "Medium" : d === "Medium" ? "Easy" : "Easy";
}

function AssessmentPage() {
  const { current } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!current) navigate({ to: "/register" });
  }, [current, navigate]);

  if (!current) return null;

  return <Engine />;
}

function Engine() {
  const { current, setCurrent, saveCompleted } = useSession();
  const navigate = useNavigate();
  const session = current!;

  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [usedIds] = useState<Set<string>>(() => new Set());
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence>("Medium");
  const [showFeedback, setShowFeedback] = useState(false);
  const startTime = useRef<number>(Date.now());

  const section: Section = SECTION_ORDER[sectionIdx];

  // load question whenever section/questionNum changes
  useEffect(() => {
    const q = pickQuestion(section, difficulty, usedIds);
    if (q) {
      usedIds.add(q.id);
      setCurrentQ(q);
      setSelected(null);
      setShowFeedback(false);
      setConfidence("Medium");
      startTime.current = Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIdx, questionNum]);

  const totalAnswered = session.answers.length;
  const totalQuestions = SECTION_ORDER.length * QUESTIONS_PER_SECTION;
  const progress = Math.round((totalAnswered / totalQuestions) * 100);

  const handleSubmit = () => {
    if (selected === null || !currentQ) return;
    const correct = selected === currentQ.answer;
    const timeMs = Date.now() - startTime.current;
    const newAnswers = [
      ...session.answers,
      {
        section,
        questionId: currentQ.id,
        correct,
        timeMs,
        confidence,
        difficulty: currentQ.difficulty,
      },
    ];
    const updated = { ...session, answers: newAnswers };
    setCurrent(updated);
    setShowFeedback(true);
    setDifficulty((d) => nextDifficulty(d, correct));

    setTimeout(() => {
      const isLastInSection = questionNum + 1 >= QUESTIONS_PER_SECTION;
      const isLastSection = sectionIdx + 1 >= SECTION_ORDER.length;
      if (isLastInSection && isLastSection) {
        const final = { ...updated, completedAt: Date.now() };
        setCurrent(final);
        saveCompleted(final);
        navigate({ to: "/results" });
      } else if (isLastInSection) {
        setSectionIdx((i) => i + 1);
        setQuestionNum(0);
        setDifficulty("Easy");
      } else {
        setQuestionNum((n) => n + 1);
      }
    }, 900);
  };

  if (!currentQ)
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="container mx-auto p-16 text-center">Loading…</div>
      </div>
    );

  const sectionMeta = SECTION_META[section];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        {/* Top status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Section {sectionIdx + 1} of {SECTION_ORDER.length}</div>
            <h1 className="text-2xl font-bold">{sectionMeta.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="glass">
              <Trophy className="mr-1 h-3 w-3" /> {difficulty}
            </Badge>
            <Badge variant="outline" className="glass">
              Q {questionNum + 1}/{QUESTIONS_PER_SECTION}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-1 text-right text-xs text-muted-foreground">{totalAnswered} / {totalQuestions} answered</div>

        <Card className="glass mt-6 border-border/40 p-8 shadow-elegant">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-secondary px-2 py-0.5">{currentQ.topic}</span>
            <span>•</span>
            <Clock className="h-3 w-3" /> live
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">{currentQ.prompt}</h2>

          <div className="mt-6 grid gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = showFeedback && i === currentQ.answer;
              const isWrong = showFeedback && isSelected && i !== currentQ.answer;
              return (
                <button
                  key={i}
                  disabled={showFeedback}
                  onClick={() => setSelected(i)}
                  className={[
                    "rounded-xl border p-4 text-left text-sm transition",
                    isCorrect
                      ? "border-accent bg-accent/15"
                      : isWrong
                        ? "border-destructive bg-destructive/10"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrect && <Check className="h-4 w-4 text-accent" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">How confident are you?</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {CONFIDENCE.map((c) => (
                <button
                  key={c}
                  disabled={showFeedback}
                  onClick={() => setConfidence(c)}
                  className={[
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition",
                    confidence === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50",
                  ].join(" ")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Exit</Link>
            <Button
              onClick={handleSubmit}
              disabled={selected === null || showFeedback}
              size="lg"
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              Submit <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Section dots */}
        <div className="mt-6 flex justify-center gap-1.5">
          {SECTION_ORDER.map((s, i) => (
            <div
              key={s}
              className={[
                "h-1.5 rounded-full transition-all",
                i < sectionIdx ? "w-6 bg-accent" : i === sectionIdx ? "w-10 bg-gradient-primary" : "w-6 bg-secondary",
              ].join(" ")}
            />
          ))}
        </div>
      </main>
    </div>
  );
}