import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession, generateCandidateId } from "@/lib/session";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Candidate Registration — Skill DNA" },
      { name: "description", content: "Register to begin a Skill DNA competency assessment." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Required").max(80),
  email: z.string().trim().email("Invalid email").max(120),
  age: z.coerce.number().min(15).max(70),
  education: z.string().trim().min(2).max(60),
  degree: z.string().trim().min(2).max(60),
  department: z.string().trim().min(2).max(60),
  yearOfStudy: z.string().trim().min(1).max(20),
  skills: z.string().trim().min(2).max(200),
  careerInterest: z.string().trim().min(2).max(80),
});

type FormVals = z.infer<typeof schema>;

function RegisterPage() {
  const { setCurrent } = useSession();
  const navigate = useNavigate();
  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      age: 21 as unknown as number,
      education: "Undergraduate",
      degree: "B.Tech",
      department: "Computer Science",
      yearOfStudy: "Final Year",
      skills: "JavaScript, React, SQL",
      careerInterest: "Full Stack Developer",
    },
  });

  const onSubmit = (vals: FormVals) => {
    const id = generateCandidateId();
    setCurrent({
      candidate: {
        ...vals,
        id,
        skills: vals.skills.split(",").map((s) => s.trim()).filter(Boolean),
      },
      answers: [],
    });
    toast.success(`Candidate ${id} registered`);
    navigate({ to: "/assessment" });
  };

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const first = Object.values(errors)[0]?.message ?? "Please fill all required fields";
    toast.error(first);
  };

  const fields: { name: keyof FormVals; label: string; type?: string; full?: boolean }[] = [
    { name: "fullName", label: "Full Name", full: true },
    { name: "email", label: "Email", type: "email" },
    { name: "age", label: "Age", type: "number" },
    { name: "education", label: "Education Level" },
    { name: "degree", label: "Degree" },
    { name: "department", label: "Department" },
    { name: "yearOfStudy", label: "Year of Study" },
    { name: "careerInterest", label: "Career Interest" },
    { name: "skills", label: "Skills (comma separated)", full: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Candidate Registration</h1>
          <p className="mt-2 text-muted-foreground">Tell us about yourself. We'll generate a unique Candidate ID.</p>
          <Card className="glass mt-8 border-border/40 p-8 shadow-elegant">
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-5 md:grid-cols-2" noValidate>
              {fields.map((f) => (
                <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
                  <Label htmlFor={f.name} className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                  <Input id={f.name} type={f.type ?? "text"} {...form.register(f.name)} className="mt-1.5" />
                  {form.formState.errors[f.name] && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors[f.name]?.message as string}</p>
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  Generate Candidate ID & Begin
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}