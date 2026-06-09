import type { Difficulty, Section } from "./session";

export interface Question {
  id: string;
  section: Section;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  answer: number; // index
  topic: string;
}

const Q = (
  id: string,
  section: Section,
  difficulty: Difficulty,
  topic: string,
  prompt: string,
  options: string[],
  answer: number,
): Question => ({ id, section, difficulty, prompt, options, answer, topic });

export const QUESTIONS: Question[] = [
  // APTITUDE
  Q("a1", "aptitude", "Easy", "Percentages", "What is 25% of 240?", ["50", "60", "70", "80"], 1),
  Q("a2", "aptitude", "Easy", "Number Series", "Next in series 2, 4, 8, 16, ?", ["20", "24", "32", "30"], 2),
  Q("a3", "aptitude", "Medium", "Ratio", "If a:b = 2:3 and b:c = 4:5, find a:c.", ["8:15", "2:5", "4:5", "3:5"], 0),
  Q("a4", "aptitude", "Medium", "Time and Work", "A does work in 10 days, B in 15. Together?", ["5", "6", "7", "8"], 1),
  Q("a5", "aptitude", "Hard", "Probability", "Probability of two heads in 3 tosses?", ["1/8", "3/8", "1/2", "1/4"], 1),
  Q("a6", "aptitude", "Hard", "Quantitative", "Sum of first 50 natural numbers?", ["1225", "1275", "1325", "1250"], 1),

  // LOGICAL
  Q("l1", "logical", "Easy", "Pattern", "Find odd: 3, 5, 7, 9, 11", ["3", "9", "5", "11"], 1),
  Q("l2", "logical", "Easy", "Sequence", "A, C, E, G, ?", ["H", "I", "J", "K"], 1),
  Q("l3", "logical", "Medium", "Analytical", "If MONDAY is coded NPOEBZ, FRIDAY is?", ["GSJEBZ", "GSIEBZ", "GSJDAY", "GSJEBA"], 0),
  Q("l4", "logical", "Medium", "Data Interpretation", "5 + 3 × 2 = ?", ["16", "11", "13", "10"], 1),
  Q("l5", "logical", "Hard", "Puzzle", "All roses are flowers. Some flowers fade quickly. Therefore?", ["All roses fade", "Some roses fade", "Cannot conclude", "No flowers fade"], 2),
  Q("l6", "logical", "Hard", "Sequence", "1, 1, 2, 3, 5, 8, ?", ["11", "12", "13", "14"], 2),

  // TECHNICAL
  Q("t1", "technical", "Easy", "Programming", "Which is not a primitive in Java?", ["int", "boolean", "String", "float"], 2),
  Q("t2", "technical", "Easy", "OOP", "OOP feature that hides data is?", ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], 2),
  Q("t3", "technical", "Medium", "Data Structures", "Stack follows which principle?", ["FIFO", "LIFO", "FILO", "Random"], 1),
  Q("t4", "technical", "Medium", "Algorithms", "Time complexity of binary search?", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 1),
  Q("t5", "technical", "Hard", "Debugging", "Output: console.log(typeof null)", ["null", "undefined", "object", "string"], 2),
  Q("t6", "technical", "Hard", "Output Prediction", "Output: [1,2,3].map(parseInt) first element?", ["1", "NaN", "0", "undefined"], 0),

  // COMMUNICATION
  Q("c1", "communication", "Easy", "Grammar", "She ___ to the market every day.", ["go", "goes", "going", "gone"], 1),
  Q("c2", "communication", "Easy", "Vocabulary", "Synonym of 'rapid'?", ["slow", "quick", "late", "calm"], 1),
  Q("c3", "communication", "Medium", "Sentence Correction", "Choose correct: 'He don't like coffee.'", ["He don't likes coffee.", "He doesn't like coffee.", "He not like coffee.", "He do not like coffee."], 1),
  Q("c4", "communication", "Medium", "Reading", "Antonym of 'transparent'?", ["clear", "opaque", "bright", "open"], 1),
  Q("c5", "communication", "Hard", "Grammar", "Identify the tense: 'I will have completed.'", ["Future Perfect", "Past Perfect", "Present Perfect", "Future Continuous"], 0),
  Q("c6", "communication", "Hard", "Vocabulary", "Meaning of 'pragmatic'?", ["Idealistic", "Practical", "Lazy", "Emotional"], 1),

  // SITUATIONAL
  Q("s1", "situational", "Easy", "Teamwork", "Teammate is struggling with a task. You:", ["Ignore", "Report them", "Offer help", "Take over"], 2),
  Q("s2", "situational", "Easy", "Ethics", "You find a colleague leaking data. You:", ["Stay silent", "Confront privately then escalate", "Join them", "Tell everyone"], 1),
  Q("s3", "situational", "Medium", "Leadership", "Project behind schedule. You:", ["Blame team", "Replan & re-prioritize", "Hide from manager", "Work alone overnight"], 1),
  Q("s4", "situational", "Medium", "Conflict", "Two teammates argue. You:", ["Pick a side", "Mediate calmly", "Walk away", "Escalate immediately"], 1),
  Q("s5", "situational", "Hard", "Decision Making", "Two urgent tasks, one resource. You:", ["Random pick", "Assess impact and decide", "Delay both", "Ask user to choose"], 1),
  Q("s6", "situational", "Hard", "Responsibility", "You made a mistake in production. You:", ["Hide it", "Blame logs", "Own it, fix, document", "Quit"], 2),
];

export function pickQuestion(section: Section, difficulty: Difficulty, usedIds: Set<string>) {
  const pool = QUESTIONS.filter(
    (q) => q.section === section && q.difficulty === difficulty && !usedIds.has(q.id),
  );
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  // fallback any unused in section
  const any = QUESTIONS.filter((q) => q.section === section && !usedIds.has(q.id));
  return any[0] ?? null;
}

export const SECTION_META: Record<Section, { title: string; description: string; questionsPerSection: number }> = {
  aptitude: { title: "Aptitude", description: "Quant, series, ratios, work, probability", questionsPerSection: 5 },
  logical: { title: "Logical Reasoning", description: "Patterns, analysis, puzzles", questionsPerSection: 5 },
  technical: { title: "Technical", description: "Programming, DS, algorithms, debugging", questionsPerSection: 5 },
  communication: { title: "Communication", description: "Grammar, vocabulary, reading", questionsPerSection: 5 },
  situational: { title: "Situational Judgment", description: "Leadership, ethics, teamwork", questionsPerSection: 5 },
};

export const SECTION_ORDER: Section[] = ["aptitude", "logical", "technical", "communication", "situational"];