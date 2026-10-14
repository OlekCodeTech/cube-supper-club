// SAMPLE DATA for the Host's Book prototype. All people are fictional.
// In production this lives in the database (Supabase), never in the page source.

import { guests as siteGuests } from "./dinners";

export const TODAY = "2026-10-14";

export type Answers = {
  workingOn: string;
  curiousAbout: string;
  lookingFor: string;
  wouldMeet: string;
  canOffer: string;
};

export type Sharing = "private" | "introductions";

export type HostGuest = {
  id: string;
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  field: string;
  dinners: string[];
  linkSentAt?: string;
  answers: { date: string; sharing: Sharing; answers: Answers; read: boolean }[];
  notes: { date: string; text: string }[];
  tags: string[];
};

export type Consent = "pending" | "yes" | "no";
export type IntroStage = "idea" | "asking" | "introduced" | "met" | "declined";

export type Intro = {
  id: string;
  a: string;
  b: string;
  why: string;
  created: string;
  stage: IntroStage;
  consentA: Consent;
  consentB: Consent;
  outcome?: string;
};

export type Suggestion = { a: string; b: string; reason: string };

const tokenOf = (name: string) => siteGuests.find((g) => g.firstName === name)?.token ?? "";

const A = (workingOn: string, curiousAbout: string, lookingFor: string, wouldMeet: string, canOffer: string): Answers => ({
  workingOn,
  curiousAbout,
  lookingFor,
  wouldMeet,
  canOffer,
});

export const hostGuests: HostGuest[] = [
  {
    id: "g01", token: tokenOf("Sarah"), firstName: "Sarah", lastName: "Whitmore", email: "sarah@example.com",
    company: "Maison Arden Hotels", field: "Luxury hospitality", dinners: ["t04"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-04", sharing: "introductions", read: false, answers: A(
      "Opening our first boutique property in Lisbon next spring.",
      "How small hotels can feel like private homes without losing service.",
      "An interior studio that understands heritage buildings.",
      "Designers, architects, people who restore old houses.",
      "Introductions across European hospitality, and an honest view on guest experience.") }],
    notes: [{ date: "2024-07-12", text: "Started the slow travel conversation at Table IV. Warm, generous, remembers everyone's name." }],
    tags: ["hospitality", "Lisbon", "interiors"],
  },
  {
    id: "g02", token: tokenOf("James"), firstName: "James", lastName: "Okafor", email: "james@example.com",
    company: "Okafor & Lane", field: "Events & experiences", dinners: ["t02", "t05", "t08"], linkSentAt: "2026-09-02",
    answers: [
      { date: "2025-03-10", sharing: "private", read: true, answers: A(
        "Rebuilding the events team after a big client left.", "Immersive dining formats.", "A new anchor client.", "Brand directors in luxury.", "Production know-how for intimate events.") },
      { date: "2026-09-06", sharing: "introductions", read: false, answers: A(
        "A touring dinner series across three European cities in 2027.",
        "Sound and scent as part of an evening.",
        "Venues with character in Paris and Copenhagen.",
        "Venue owners, perfumers, anyone who thinks about atmosphere.",
        "I can produce an event end to end, and I know most London suppliers.") },
    ],
    notes: [{ date: "2025-05-23", text: "Third dinner. Always the last to leave. Natural connector himself." }],
    tags: ["events", "venues", "regular"],
  },
  {
    id: "g03", token: tokenOf("Anna"), firstName: "Anna", lastName: "Lindqvist", email: "anna@example.com",
    company: "Studio Lindqvist", field: "Interior architecture", dinners: ["t07"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-12", sharing: "introductions", read: true, answers: A(
      "Restoring a Georgian townhouse in Bath as a private members' space.",
      "Lime plaster, old craft techniques, slow materials.",
      "Hospitality clients who care about heritage.",
      "Hotel founders and people opening something small and special.",
      "A designer's eye on any space, and a network of craftspeople.") }],
    notes: [],
    tags: ["interiors", "heritage"],
  },
  {
    id: "g04", token: "m2x8c5vq1n", firstName: "Olivia", lastName: "Hart", email: "olivia@example.com",
    company: "Hart Fine Jewellery", field: "Jewellery", dinners: ["t01", "t06"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-03", sharing: "private", read: true, answers: A(
      "A bridal collection made with recycled gold.", "Traceability in gemstones.", "Advice on going direct-to-client.", "Founders who left wholesale.", "Twenty years of craft and a trusted workshop.") }],
    notes: [{ date: "2024-11-22", text: "Prefers privacy. Ask before mentioning her to anyone." }],
    tags: ["jewellery", "craft"],
  },
  {
    id: "g05", token: "p9d3h7ks2w", firstName: "Daniel", lastName: "Reyes", email: "daniel@example.com",
    company: "Northfield Capital", field: "Investment", dinners: ["t03"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-18", sharing: "introductions", read: true, answers: A(
      "A small fund for independent hospitality brands.", "Why some restaurants last 50 years.", "Founders with one great property who want a second.", "Hotel and restaurant founders.", "Capital, and patience with it.") }],
    notes: [],
    tags: ["investment", "hospitality"],
  },
  {
    id: "g06", token: "t4f6b8nm3r", firstName: "Emma", lastName: "Castell", email: "emma@example.com",
    company: "Castell PR", field: "PR & communications", dinners: ["t05"], linkSentAt: "2026-09-02",
    answers: [], notes: [], tags: ["PR"],
  },
  {
    id: "g07", token: "h1k5w9pz7c", firstName: "Tom", lastName: "Ashby", email: "tom@example.com",
    company: "Ashby Private Travel", field: "Private client travel", dinners: ["t02", "t09"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-05", sharing: "introductions", read: true, answers: A(
      "Designing week-long journeys around a single dinner.", "Rail travel coming back into luxury.", "Small hotels in Portugal and Scandinavia.", "Hoteliers with fewer than 30 rooms.", "Clients who travel well and spend thoughtfully.") }],
    notes: [], tags: ["travel", "private clients"],
  },
  {
    id: "g08", token: "z6n2r4yd8q", firstName: "Sophie", lastName: "Marlow", email: "sophie@example.com",
    company: "Marlow Atelier", field: "Fashion", dinners: ["t05", "t08"], linkSentAt: "2026-09-02",
    answers: [{ date: "2025-01-20", sharing: "introductions", read: true, answers: A(
      "Moving the atelier from London to Somerset.", "Wool from British farms.", "A place for small runway evenings.", "Venue owners, event producers.", "Styling and a seat at fashion week for the right person.") }],
    notes: [], tags: ["fashion"],
  },
  {
    id: "g09", token: "c8v3m1xb5j", firstName: "Leo", lastName: "Brandt", email: "leo@example.com",
    company: "Brandt Wines", field: "Wine", dinners: ["t03", "t06"], linkSentAt: "2026-09-02",
    answers: [], notes: [], tags: ["wine"],
  },
  {
    id: "g10", token: "q7w2e9rt4y", firstName: "Isabel", lastName: "Ferreira", email: "isabel@example.com",
    company: "Casa Ferreira", field: "Venues", dinners: ["t09"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-21", sharing: "introductions", read: false, answers: A(
      "Opening a 1920s Paris apartment as a venue for private dinners.", "How a room changes a conversation.", "Producers who run intimate evenings.", "Event people, chefs, hosts.", "A beautiful room in Paris and a good address book there.") }],
    notes: [], tags: ["venues", "Paris"],
  },
  {
    id: "g11", token: "u5i8o2pa6s", firstName: "Marcus", lastName: "Hale", email: "marcus@example.com",
    company: "Hale Architecture", field: "Architecture", dinners: ["t01"], linkSentAt: "2026-09-02",
    answers: [], notes: [], tags: ["architecture"],
  },
  {
    id: "g12", token: "d3f7g1hj9k", firstName: "Chloe", lastName: "Dupont", email: "chloe@example.com",
    company: "Atelier Nez", field: "Perfume", dinners: ["t08"], linkSentAt: "2026-09-02",
    answers: [{ date: "2026-09-25", sharing: "introductions", read: false, answers: A(
      "Bespoke scents for spaces, not people.", "Memory and smell.", "Hotels and events that want a signature scent.", "Hoteliers, event designers.", "A scent workshop for any team or evening.") }],
    notes: [], tags: ["perfume", "atmosphere"],
  },
  {
    id: "g13", token: "l2z4x6cv8b", firstName: "Hannah", lastName: "Kerr", email: "hannah@example.com",
    company: "Kerr Gallery", field: "Art", dinners: ["t04"], linkSentAt: "2026-09-02",
    answers: [], notes: [], tags: ["art"],
  },
  {
    id: "g14", token: "n9m7b5v3c1", firstName: "Rafael", lastName: "Santos", email: "rafael@example.com",
    company: "Santos Kitchen", field: "Chef", dinners: ["t06"],
    answers: [], notes: [{ date: "2024-11-22", text: "Cooked for us once at Table VI. Link not sent yet — ask first." }], tags: ["chef"],
  },
];

export const intros: Intro[] = [
  {
    id: "i01", a: "g03", b: "g01", created: "2026-09-13", stage: "asking", consentA: "yes", consentB: "pending",
    why: "Sarah is looking for an interior studio for a heritage building in Lisbon; Anna restores Georgian houses and wants hospitality clients.",
  },
  {
    id: "i02", a: "g02", b: "g10", created: "2026-09-22", stage: "introduced", consentA: "yes", consentB: "yes",
    why: "James needs venues with character in Paris for the 2027 tour; Isabel is opening exactly that.",
  },
  {
    id: "i03", a: "g07", b: "g01", created: "2025-02-10", stage: "met", consentA: "yes", consentB: "yes",
    why: "Tom sends private clients to small hotels in Portugal.",
    outcome: "Met in March. Tom now sends clients to Sarah's partner hotels.",
  },
  {
    id: "i04", a: "g08", b: "g02", created: "2025-01-22", stage: "declined", consentA: "yes", consentB: "no",
    why: "Sophie wanted a producer for small runway evenings.",
    outcome: "James was rebuilding his team at the time. Try again later.",
  },
];

export const suggestions: Suggestion[] = [
  { a: "g12", b: "g02", reason: "James is curious about scent as part of an evening; Chloe creates signature scents for events." },
  { a: "g05", b: "g01", reason: "Daniel backs founders with one great property who want a second; Sarah is opening her next one in Lisbon." },
  { a: "g12", b: "g10", reason: "Both think about how a room shapes a conversation; Isabel's Paris venue could use a signature scent." },
];
