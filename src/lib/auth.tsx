import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role =
  | "principal"
  | "admin"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "hr"
  | "librarian"
  | "transport"
  | "hostel";

export type DemoAccount = {
  role: Role;
  emoji: string;
  labelNp: string;
  labelEn: string;
  username: string;
  password: string;
  name: string;
  nameNp: string;
  subtitle: string;
  home: string;
  avatar: string;
};

const av = (seed: string, bg: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=${bg}`;

/** Presentation-only demo credentials. No backend, no network calls. */
export const demoAccounts: DemoAccount[] = [
  {
    role: "principal",
    emoji: "🏫",
    labelNp: "प्रधानाध्यापक",
    labelEn: "Principal",
    username: "principal",
    password: "principal123",
    name: "Dr. Bishnu Prasad Sharma",
    nameNp: "डा. विष्णुप्रसाद शर्मा",
    subtitle: "Principal · Shree Himalaya Adarsha",
    home: "/",
    avatar: av("Bishnu", "ffd5a6"),
  },
  {
    role: "admin",
    emoji: "🛡️",
    labelNp: "प्रशासक",
    labelEn: "School Admin",
    username: "admin",
    password: "admin123",
    name: "Kabita Gurung",
    nameNp: "कविता गुरुङ",
    subtitle: "School administrator · Office",
    home: "/",
    avatar: av("Kabita", "c0e6d9"),
  },
  {
    role: "teacher",
    emoji: "👩‍🏫",
    labelNp: "शिक्षक",
    labelEn: "Teacher",
    username: "teacher",
    password: "teacher123",
    name: "Sarita Adhikari",
    nameNp: "सरिता अधिकारी",
    subtitle: "Mathematics · Grade 8–10",
    home: "/teacher-portal",
    avatar: av("Sarita", "c0e6d9"),
  },
  {
    role: "student",
    emoji: "🧑‍🎓",
    labelNp: "विद्यार्थी",
    labelEn: "Student",
    username: "student",
    password: "student123",
    name: "Aarav Sharma",
    nameNp: "आरव शर्मा",
    subtitle: "Grade 8 · Section A · Roll 12",
    home: "/student-portal",
    avatar: av("Aarav", "d9d5f5"),
  },
  {
    role: "parent",
    emoji: "👨‍👩‍👧",
    labelNp: "अभिभावक",
    labelEn: "Parent",
    username: "parent",
    password: "parent123",
    name: "Rajendra Sharma",
    nameNp: "राजेन्द्र शर्मा",
    subtitle: "Guardian of Aarav Sharma",
    home: "/parent-portal",
    avatar: av("Rajendra", "ffd5a6"),
  },
  {
    role: "accountant",
    emoji: "💳",
    labelNp: "लेखापाल",
    labelEn: "Accountant",
    username: "accountant",
    password: "accounts123",
    name: "Nirmala Thapa",
    nameNp: "निर्मला थापा",
    subtitle: "Finance office · Fees & ledger",
    home: "/fees",
    avatar: av("Nirmala", "ffd5a6"),
  },
  {
    role: "hr",
    emoji: "👥",
    labelNp: "मानव संसाधन",
    labelEn: "HR / Staff",
    username: "hr",
    password: "hr123",
    name: "Prakash Karki",
    nameNp: "प्रकाश कार्की",
    subtitle: "Human resources · Payroll",
    home: "/hr",
    avatar: av("Prakash", "c0e6d9"),
  },
  {
    role: "librarian",
    emoji: "📖",
    labelNp: "पुस्तकालय",
    labelEn: "Librarian",
    username: "librarian",
    password: "library123",
    name: "Sunita Rai",
    nameNp: "सुनिता राई",
    subtitle: "Library desk · Issue & returns",
    home: "/library",
    avatar: av("Sunita", "d9d5f5"),
  },
  {
    role: "transport",
    emoji: "🚌",
    labelNp: "यातायात",
    labelEn: "Transport Manager",
    username: "transport",
    password: "transport123",
    name: "Dipak Bhandari",
    nameNp: "दीपक भण्डारी",
    subtitle: "Routes · Buses · Drivers",
    home: "/transport",
    avatar: av("Dipak", "ffd5a6"),
  },
  {
    role: "hostel",
    emoji: "🏠",
    labelNp: "छात्रावास",
    labelEn: "Hostel Manager",
    username: "hostel",
    password: "hostel123",
    name: "Maya Tamang",
    nameNp: "माया तामाङ",
    subtitle: "Hostel wardens · Rooms & beds",
    home: "/hostel",
    avatar: av("Maya", "c0e6d9"),
  },
];

export const accountFor = (role: Role): DemoAccount =>
  demoAccounts.find((a) => a.role === role) ?? demoAccounts[0]!;

const STORAGE_KEY = "vidya-erp-session";

type Ctx = {
  user: DemoAccount | null;
  role: Role;
  ready: boolean;
  signIn: (username: string, password: string) => { ok: boolean; account?: DemoAccount; error?: string };
  signInAs: (role: Role) => DemoAccount;
  signOut: () => void;
};

const AuthContext = createContext<Ctx>({
  user: null,
  role: "principal",
  ready: false,
  signIn: () => ({ ok: false }),
  signInAs: () => demoAccounts[0]!,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoAccount | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const found = demoAccounts.find((a) => a.role === (raw as Role)) ?? null;
      setUser(found);
    } catch {
      setUser(null);
    }
    setReady(true);
  }, []);

  const persist = useCallback((account: DemoAccount | null) => {
    try {
      if (account) localStorage.setItem(STORAGE_KEY, account.role);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — session stays in memory only */
    }
  }, []);

  const signIn = useCallback<Ctx["signIn"]>(
    (username, password) => {
      const id = username.trim().toLowerCase();
      const account = demoAccounts.find(
        (a) => a.username === id || `${a.username}@himalayaadarsha.edu.np` === id,
      );
      if (!account) return { ok: false, error: "no-user" };
      if (account.password !== password) return { ok: false, error: "bad-password" };
      setUser(account);
      persist(account);
      return { ok: true, account };
    },
    [persist],
  );

  const signInAs = useCallback<Ctx["signInAs"]>(
    (role) => {
      const account = accountFor(role);
      setUser(account);
      persist(account);
      return account;
    },
    [persist],
  );

  const signOut = useCallback(() => {
    setUser(null);
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, role: user?.role ?? "principal", ready, signIn, signInAs, signOut }),
    [user, ready, signIn, signInAs, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
