import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Confidence = "Very High" | "High" | "Medium" | "Low";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Section =
  | "aptitude"
  | "logical"
  | "technical"
  | "communication"
  | "situational";

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  age: number;
  education: string;
  degree: string;
  department: string;
  yearOfStudy: string;
  skills: string[];
  careerInterest: string;
}

export interface AnswerRecord {
  section: Section;
  questionId: string;
  correct: boolean;
  timeMs: number;
  confidence: Confidence;
  difficulty: Difficulty;
}

export interface CandidateSession {
  candidate: Candidate;
  answers: AnswerRecord[];
  completedAt?: number;
  resumeText?: string;
}

interface Ctx {
  current: CandidateSession | null;
  setCurrent: (s: CandidateSession | null) => void;
  all: CandidateSession[];
  saveCompleted: (s: CandidateSession) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<CandidateSession | null>(null);
  const [all, setAll] = useState<CandidateSession[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <SessionCtx.Provider
      value={{
        current,
        setCurrent,
        all,
        saveCompleted: (s) =>
          setAll((prev) => [...prev.filter((p) => p.candidate.id !== s.candidate.id), s]),
        theme,
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </SessionCtx.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("SessionProvider missing");
  return ctx;
}

export function generateCandidateId() {
  return "CND-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}