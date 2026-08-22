import type { Role } from "@/lib/auth";

export type NavItem = { to: string; key: string; emoji: string };
export type NavGroup = { key: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    key: "group.overview",
    items: [
      { to: "/", key: "nav.dashboard", emoji: "🏠" },
      { to: "/analytics", key: "nav.analytics", emoji: "📊" },
      { to: "/calendar", key: "nav.calendar", emoji: "📆" },
    ],
  },
  {
    key: "group.people",
    items: [
      { to: "/admissions", key: "nav.admissions", emoji: "🎓" },
      { to: "/students", key: "nav.students", emoji: "👨‍🎓" },
      { to: "/teachers", key: "nav.teachers", emoji: "👩‍🏫" },
      { to: "/hr", key: "nav.hr", emoji: "👥" },
    ],
  },
  {
    key: "group.academic",
    items: [
      { to: "/academics", key: "nav.academics", emoji: "🏫" },
      { to: "/timetable", key: "nav.timetable", emoji: "📅" },
      { to: "/attendance", key: "nav.attendance", emoji: "✅" },
      { to: "/exams", key: "nav.exams", emoji: "📝" },
      { to: "/results", key: "nav.results", emoji: "🏆" },
      { to: "/homework", key: "nav.homework", emoji: "✏️" },
      { to: "/lms", key: "nav.lms", emoji: "📚" },
    ],
  },
  {
    key: "group.finance",
    items: [
      { to: "/fees", key: "nav.fees", emoji: "💰" },
      { to: "/accounting", key: "nav.accounting", emoji: "💳" },
    ],
  },
  {
    key: "group.operations",
    items: [
      { to: "/library", key: "nav.library", emoji: "📖" },
      { to: "/transport", key: "nav.transport", emoji: "🚌" },
      { to: "/hostel", key: "nav.hostel", emoji: "🏠" },
      { to: "/communication", key: "nav.communication", emoji: "📢" },
    ],
  },
  {
    key: "group.portals",
    items: [
      { to: "/teacher-portal", key: "nav.teacherPortal", emoji: "👩‍🏫" },
      { to: "/student-portal", key: "nav.studentPortal", emoji: "🧑‍🎓" },
      { to: "/parent-portal", key: "nav.parentPortal", emoji: "👨‍👩‍👧" },
    ],
  },
  {
    key: "group.system",
    items: [
      { to: "/notifications", key: "nav.notifications", emoji: "🔔" },
      { to: "/settings", key: "nav.settings", emoji: "⚙️" },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { to: "/", key: "nav.dashboard", emoji: "🏠" },
  { to: "/lms", key: "nav.lms", emoji: "📚" },
  { to: "/calendar", key: "nav.calendar", emoji: "📆" },
  { to: "/notifications", key: "nav.notifications", emoji: "🔔" },
  { to: "/student-portal", key: "nav.studentPortal", emoji: "👤" },
];

/* --------------------------- Role-based visibility -------------------------- */


const common = ["/notifications", "/calendar", "/settings", "/school-profile"];

/** Routes each role is allowed to see in navigation. */
export const roleAccess: Record<Role, string[]> = {
  principal: [
    "/", "/analytics", "/admissions", "/students", "/teachers", "/hr", "/academics",
    "/timetable", "/attendance", "/exams", "/results", "/homework", "/lms", "/fees",
    "/accounting", "/library", "/transport", "/hostel", "/communication",
    "/teacher-portal", "/student-portal", "/parent-portal", ...common,
  ],
  admin: [
    "/", "/analytics", "/admissions", "/students", "/teachers", "/academics", "/timetable",
    "/attendance", "/exams", "/results", "/communication", "/library", "/transport",
    "/hostel", "/fees", ...common,
  ],
  teacher: [
    "/", "/teacher-portal", "/students", "/academics", "/timetable", "/attendance",
    "/exams", "/results", "/homework", "/lms", ...common,
  ],
  student: [
    "/student-portal", "/timetable", "/attendance", "/homework", "/results", "/exams",
    "/lms", "/library", ...common,
  ],
  parent: [
    "/parent-portal", "/attendance", "/results", "/homework", "/fees", "/timetable",
    "/communication", "/transport", ...common,
  ],
  accountant: ["/", "/fees", "/accounting", "/analytics", "/students", ...common],
  hr: ["/", "/hr", "/teachers", "/attendance", "/accounting", ...common],
  librarian: ["/library", "/students", "/lms", ...common],
  transport: ["/transport", "/students", "/attendance", ...common],
  hostel: ["/hostel", "/students", "/attendance", "/fees", ...common],
};

export function navGroupsFor(role: Role): NavGroup[] {
  const allow = new Set(roleAccess[role] ?? []);
  return navGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => allow.has(i.to)) }))
    .filter((g) => g.items.length > 0);
}

export function bottomNavFor(role: Role): NavItem[] {
  const allow = new Set(roleAccess[role] ?? []);
  const items = bottomNav.filter((i) => allow.has(i.to));
  if (items.length >= 5) return items.slice(0, 5);
  const extra = navGroups
    .flatMap((g) => g.items)
    .filter((i) => allow.has(i.to) && !items.some((x) => x.to === i.to));
  return [...items, ...extra].slice(0, 5);
}

export function homeFor(role: Role): string {
  return (roleAccess[role] ?? ["/"])[0] ?? "/";
}
