import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { school } from "@/data/seed";
import { TODAY_AD, TODAY_BS, formatAd, formatBs } from "@/lib/bs-date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Vidya ERP for Nepali Schools" },
      { name: "description", content: "Secure sign-in for students, teachers, parents and school administrators of Shree Himalaya Adarsha Secondary School." },
      { property: "og:title", content: "Sign in — Vidya ERP" },
      { property: "og:description", content: "Secure sign-in for students, teachers, parents and school administrators." },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { emoji: "🏫", np: "प्रशासक", en: "Admin" },
  { emoji: "👩‍🏫", np: "शिक्षक", en: "Teacher" },
  { emoji: "🧑‍🎓", np: "विद्यार्थी", en: "Student" },
  { emoji: "👨‍👩‍👧", np: "अभिभावक", en: "Parent" },
];

function LoginPage() {
  const { t, lang, setLang } = useI18n();
  const [role, setRole] = useState(0);
  const [show, setShow] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Illustration side */}
      <div className="relative hidden overflow-hidden gradient-ink p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="paper-grid absolute inset-0 opacity-[0.18]" />
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-warning/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl gradient-hero text-2xl shadow-glow">🎓</span>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">Vidya ERP</p>
            <p className="np text-[11px] text-sidebar-foreground/60">{school.nameNp}</p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <p className="np text-sm font-semibold tracking-wide text-warning">🇳🇵 {school.motto}</p>
          <h2 className="np mt-4 text-4xl leading-tight font-bold text-sidebar-foreground">
            {lang === "np"
              ? "नेपालका विद्यालयका लागि बनेको आधुनिक शैक्षिक प्रणाली"
              : "A modern education platform built for Nepali schools"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            {lang === "np"
              ? "भर्नादेखि नतिजासम्म, हाजिरीदेखि शुल्कसम्म — विक्रम सम्बत् पात्रोसहित एउटै ठाउँमा।"
              : "From admissions to results, attendance to fees — everything in one place, with a native Bikram Sambat calendar."}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["📚 Academics", "🎒 Students", "👩‍🏫 Teachers", "🚌 Transport", "🏆 Results", "💰 Fees"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-sidebar-border bg-sidebar-accent/60 px-3 py-1.5 text-xs font-medium text-sidebar-foreground/85"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { emoji: "👨‍🎓", value: "1,024", label: lang === "np" ? "विद्यार्थी" : "Students" },
            { emoji: "👩‍🏫", value: "68", label: lang === "np" ? "शिक्षक" : "Teachers" },
            { emoji: "🏫", value: "24", label: lang === "np" ? "कक्षा" : "Classes" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
              <span className="text-xl">{s.emoji}</span>
              <p className="mt-2 text-xl font-bold text-sidebar-foreground">{s.value}</p>
              <p className="text-[11px] text-sidebar-foreground/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center gradient-soft px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl gradient-hero text-lg">🎓</span>
              <span className="text-sm font-bold">Vidya ERP</span>
            </div>
            <div className="ml-auto flex items-center rounded-full border border-border bg-card p-0.5">
              <button
                type="button"
                onClick={() => setLang("np")}
                className={cn(
                  "np rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  lang === "np" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                नेपाली
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                English
              </button>
            </div>
          </div>

          <div className="animate-rise surface p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-2xl">🏫</span>
              <div className="min-w-0">
                <p className="np truncate text-sm font-bold">{lang === "np" ? school.nameNp : school.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "np" ? "स्थापना" : "Established"} {school.estd} · Pokhara, Nepal
                </p>
              </div>
            </div>

            <h1 className="np mt-6 text-2xl font-bold">{t("login.welcome")} 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "np" ? "आफ्नो खातामा साइन इन गर्नुहोस्।" : "Sign in to continue to your school workspace."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {roles.map((r, i) => (
                <button
                  key={r.en}
                  type="button"
                  onClick={() => setRole(i)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    role === i
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {r.emoji} {lang === "np" ? r.np : r.en}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <Label htmlFor="user" className="text-xs font-semibold">{t("login.username")}</Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="user"
                    defaultValue="principal@himalayaadarsha.edu.np"
                    className="h-11 w-full rounded-xl border border-input bg-card pr-3 pl-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pass" className="text-xs font-semibold">{t("login.password")}</Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="pass"
                    type={show ? "text" : "password"}
                    defaultValue="vidya2083"
                    className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label="Toggle password"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Checkbox defaultChecked /> {t("login.remember")}
                </label>
                <button type="button" className="text-xs font-semibold text-primary hover:underline">
                  {t("login.forgot")}
                </button>
              </div>

              <Button asChild size="lg" className="w-full rounded-xl gradient-hero text-base shadow-glow">
                <Link to="/">{t("login.submit")} →</Link>
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-4 text-[11px]">
              <span className="np rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {formatBs(TODAY_BS, lang)}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                {formatAd(TODAY_AD)} AD
              </span>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            🇳🇵 {lang === "np" ? "नेपालमा नेपाली विद्यालयका लागि निर्मित" : "Made in Nepal, for Nepali schools"}
          </p>
        </div>
      </div>
    </div>
  );
}
