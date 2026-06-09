import type { AnswerRecord, CandidateSession, Confidence } from "./session";
import { SECTION_ORDER } from "./questions";

const CONF_VAL: Record<Confidence, number> = { "Very High": 1, High: 0.75, Medium: 0.5, Low: 0.25 };

export interface SectionScore {
  section: string;
  correct: number;
  total: number;
  percentage: number;
  avgTime: number;
}

export function sectionScores(answers: AnswerRecord[]): SectionScore[] {
  return SECTION_ORDER.map((s) => {
    const list = answers.filter((a) => a.section === s);
    const correct = list.filter((a) => a.correct).length;
    const total = list.length;
    const avgTime = total ? list.reduce((acc, a) => acc + a.timeMs, 0) / total / 1000 : 0;
    return {
      section: s,
      correct,
      total,
      percentage: total ? Math.round((correct / total) * 100) : 0,
      avgTime: +avgTime.toFixed(1),
    };
  });
}

export function efficiencyScore(answers: AnswerRecord[]) {
  if (!answers.length) return 0;
  const accuracy = answers.filter((a) => a.correct).length / answers.length;
  const avgTime = answers.reduce((a, b) => a + b.timeMs, 0) / answers.length / 1000;
  // ideal ~15s/q
  const speed = Math.max(0, Math.min(1, 1 - Math.max(0, avgTime - 15) / 60));
  return Math.round((accuracy * 0.6 + speed * 0.4) * 100);
}

export function speedScore(answers: AnswerRecord[]) {
  if (!answers.length) return 0;
  const avg = answers.reduce((a, b) => a + b.timeMs, 0) / answers.length / 1000;
  return Math.round(Math.max(0, Math.min(100, 100 - (avg - 10) * 4)));
}

export function accuracyScore(answers: AnswerRecord[]) {
  if (!answers.length) return 0;
  return Math.round((answers.filter((a) => a.correct).length / answers.length) * 100);
}

export function confidenceIndex(answers: AnswerRecord[]) {
  if (!answers.length) return 0;
  let aligned = 0;
  answers.forEach((a) => {
    const c = CONF_VAL[a.confidence];
    aligned += 1 - Math.abs((a.correct ? 1 : 0) - c);
  });
  return Math.round((aligned / answers.length) * 100);
}

export function focusStability(answers: AnswerRecord[]) {
  if (answers.length < 2) return 100;
  const times = answers.map((a) => a.timeMs / 1000);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length;
  const std = Math.sqrt(variance);
  return Math.round(Math.max(0, Math.min(100, 100 - std * 5)));
}

export function decisionStyle(answers: AnswerRecord[]): "Safe" | "Balanced" | "Aggressive" {
  if (!answers.length) return "Balanced";
  const avgTime = answers.reduce((a, b) => a + b.timeMs, 0) / answers.length / 1000;
  const highConf = answers.filter((a) => a.confidence === "Very High" || a.confidence === "High").length / answers.length;
  if (avgTime < 10 && highConf > 0.6) return "Aggressive";
  if (avgTime > 25) return "Safe";
  return "Balanced";
}

export function overallScore(answers: AnswerRecord[]) {
  const s = sectionScores(answers);
  const map: Record<string, number> = Object.fromEntries(s.map((x) => [x.section, x.percentage]));
  const eff = efficiencyScore(answers);
  return Math.round(
    (map.technical ?? 0) * 0.3 +
      (map.aptitude ?? 0) * 0.2 +
      (map.logical ?? 0) * 0.15 +
      (map.communication ?? 0) * 0.15 +
      (map.situational ?? 0) * 0.1 +
      eff * 0.1,
  );
}

export function careerReadiness(answers: AnswerRecord[]) {
  const o = overallScore(answers);
  const f = focusStability(answers);
  const c = confidenceIndex(answers);
  return Math.round(o * 0.7 + f * 0.15 + c * 0.15);
}

export function readinessLevel(score: number) {
  if (score >= 85) return "Highly Competitive";
  if (score >= 70) return "Industry Ready";
  if (score >= 55) return "Employable";
  if (score >= 40) return "Developing";
  return "Beginner";
}

export function hiringRecommendation(score: number) {
  if (score >= 80) return "Highly Recommended";
  if (score >= 65) return "Recommended";
  if (score >= 45) return "Consider After Training";
  return "Not Yet Ready";
}

export function interviewReadiness(answers: AnswerRecord[]) {
  return Math.round(overallScore(answers) * 0.6 + confidenceIndex(answers) * 0.4);
}

export interface SkillDNA {
  technical: number;
  problemSolving: number;
  logical: number;
  learningAgility: number;
  communication: number;
  consistency: number;
  decisionSpeed: number;
  accuracyPressure: number;
}

export function skillDNA(answers: AnswerRecord[]): SkillDNA {
  const s = sectionScores(answers);
  const m: Record<string, number> = Object.fromEntries(s.map((x) => [x.section, x.percentage]));
  const hard = answers.filter((a) => a.difficulty === "Hard");
  return {
    technical: m.technical ?? 0,
    problemSolving: Math.round(((m.logical ?? 0) + (m.technical ?? 0)) / 2),
    logical: m.logical ?? 0,
    learningAgility: Math.min(100, Math.round(((m.aptitude ?? 0) + efficiencyScore(answers)) / 2)),
    communication: m.communication ?? 0,
    consistency: focusStability(answers),
    decisionSpeed: speedScore(answers),
    accuracyPressure: hard.length
      ? Math.round((hard.filter((a) => a.correct).length / hard.length) * 100)
      : accuracyScore(answers),
  };
}

const COMPETENCY_LABELS: Record<keyof SkillDNA, string> = {
  technical: "Technical Skills",
  problemSolving: "Problem Solving",
  logical: "Logical Reasoning",
  learningAgility: "Learning Agility",
  communication: "Communication",
  consistency: "Consistency",
  decisionSpeed: "Decision Speed",
  accuracyPressure: "Accuracy Under Pressure",
};

export function topStrengths(dna: SkillDNA, n = 5) {
  return (Object.entries(dna) as [keyof SkillDNA, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => ({ label: COMPETENCY_LABELS[k], value: v }));
}

export function topImprovements(dna: SkillDNA, n = 5) {
  return (Object.entries(dna) as [keyof SkillDNA, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, n)
    .map(([k, v]) => ({ label: COMPETENCY_LABELS[k], value: v }));
}

export const ROLE_DEFS: { role: string; weights: Partial<Record<keyof SkillDNA, number>>; coreSkills: string[] }[] = [
  { role: "Software Developer", weights: { technical: 0.4, problemSolving: 0.3, logical: 0.2, communication: 0.1 }, coreSkills: ["Programming", "OOP", "Data Structures", "Algorithms"] },
  { role: "Frontend Developer", weights: { technical: 0.35, communication: 0.2, problemSolving: 0.25, learningAgility: 0.2 }, coreSkills: ["HTML", "CSS", "JavaScript", "React"] },
  { role: "Backend Developer", weights: { technical: 0.4, logical: 0.3, problemSolving: 0.2, accuracyPressure: 0.1 }, coreSkills: ["APIs", "Databases", "Algorithms", "System Design"] },
  { role: "Full Stack Developer", weights: { technical: 0.35, problemSolving: 0.25, communication: 0.15, learningAgility: 0.25 }, coreSkills: ["Frontend", "Backend", "Databases", "APIs"] },
  { role: "Data Analyst", weights: { logical: 0.35, problemSolving: 0.25, technical: 0.2, communication: 0.2 }, coreSkills: ["SQL", "Excel", "Statistics", "Visualization"] },
  { role: "QA Engineer", weights: { accuracyPressure: 0.3, consistency: 0.25, technical: 0.25, logical: 0.2 }, coreSkills: ["Testing", "Automation", "Bug Tracking", "Selenium"] },
  { role: "Technical Support Engineer", weights: { communication: 0.35, problemSolving: 0.25, technical: 0.25, decisionSpeed: 0.15 }, coreSkills: ["Troubleshooting", "Communication", "OS", "Networking"] },
  { role: "Business Analyst", weights: { communication: 0.3, logical: 0.3, problemSolving: 0.2, learningAgility: 0.2 }, coreSkills: ["Requirements", "Documentation", "SQL", "Stakeholder Mgmt"] },
  { role: "Project Coordinator", weights: { communication: 0.35, consistency: 0.25, decisionSpeed: 0.2, problemSolving: 0.2 }, coreSkills: ["Planning", "Coordination", "Reporting", "Tools"] },
];

export function roleMatches(dna: SkillDNA, candidateSkills: string[]) {
  return ROLE_DEFS.map((r) => {
    let score = 0;
    let total = 0;
    for (const [k, w] of Object.entries(r.weights)) {
      score += (dna[k as keyof SkillDNA] ?? 0) * (w as number);
      total += w as number;
    }
    const match = Math.round(score / (total || 1));
    const lowerSkills = candidateSkills.map((s) => s.toLowerCase());
    const missing = r.coreSkills.filter((c) => !lowerSkills.some((s) => c.toLowerCase().includes(s) || s.includes(c.toLowerCase())));
    return {
      role: r.role,
      match,
      reason: topReason(r.role, dna),
      missing,
      suggested: missing.slice(0, 3).map((m) => `Learn ${m}`),
    };
  }).sort((a, b) => b.match - a.match);
}

function topReason(role: string, dna: SkillDNA) {
  const best = (Object.entries(dna) as [keyof SkillDNA, number][]).sort((a, b) => b[1] - a[1])[0];
  return `Strong ${COMPETENCY_LABELS[best[0]]} (${best[1]}%) aligns with ${role}.`;
}

export function analyzeResume(text: string, candidateSkills: string[]) {
  const lower = text.toLowerCase();
  const KEYWORDS = ["javascript", "react", "python", "java", "sql", "html", "css", "node", "git", "aws", "docker", "rest", "api", "agile", "linux"];
  const found = KEYWORDS.filter((k) => lower.includes(k));
  const hasProjects = /project|built|developed|implemented/.test(lower);
  const hasEducation = /university|college|b\.?tech|bachelor|degree|diploma/i.test(text);
  const score = Math.min(100, found.length * 6 + (hasProjects ? 15 : 0) + (hasEducation ? 10 : 0) + (candidateSkills.length ? 10 : 0));
  const missing = KEYWORDS.filter((k) => !found.includes(k)).slice(0, 5);
  return { score, skillsFound: found, hasProjects, hasEducation, missing };
}

export function badges(session: CandidateSession) {
  const a = session.answers;
  const s = sectionScores(a);
  const map = Object.fromEntries(s.map((x) => [x.section, x.percentage]));
  const out: { name: string; tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Elite" }[] = [];
  const tierFor = (p: number) =>
    p >= 90 ? "Elite" : p >= 80 ? "Platinum" : p >= 70 ? "Gold" : p >= 55 ? "Silver" : "Bronze";
  if ((map.aptitude ?? 0) >= 60) out.push({ name: "Aptitude Master", tier: tierFor(map.aptitude) });
  if ((map.logical ?? 0) >= 60) out.push({ name: "Logic Expert", tier: tierFor(map.logical) });
  if ((map.technical ?? 0) >= 60) out.push({ name: "Coding Specialist", tier: tierFor(map.technical) });
  if (speedScore(a) >= 70) out.push({ name: "Fast Thinker", tier: tierFor(speedScore(a)) });
  if (overallScore(a) >= 75) out.push({ name: "Top Performer", tier: tierFor(overallScore(a)) });
  return out;
}

export { COMPETENCY_LABELS };