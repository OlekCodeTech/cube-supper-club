// New guests — the invitation path (brief, group A).
// PROTOTYPE DATA: the upcoming table and the invited guest are examples.

export type UpcomingTable = {
  id: string;
  number: number;
  date: string; // ISO
  time: string;
  venue: string;
  city: string;
  seats: number;
  confirmed: number;
  /** Worlds represented at the table. Never names. */
  fields: string[];
  replyBy: string; // ISO
};

export type Invitation = {
  token: string;
  firstName: string;
  tableId: string;
  /** Michał's own sentence: why this person. */
  why: string;
};

export const upcoming: UpcomingTable[] = [
  {
    id: "t10",
    number: 10,
    date: "2026-11-19",
    time: "19:00 – late",
    venue: "Ham Yard Hotel",
    city: "London",
    seats: 10,
    confirmed: 6,
    fields: ["Hospitality", "Fashion", "Perfume", "Investment", "Architecture", "Wine"],
    replyBy: "2026-11-05",
  },
];

export const invitations: Invitation[] = [
  {
    token: "v6b1n8qx3m",
    firstName: "Charlotte",
    tableId: "t10",
    why: "You think about places the way few people do. I’d love you to meet the people around this table, and I think they’d love to meet you.",
  },
];

export const getInvitation = (token: string) => invitations.find((i) => i.token === token);
export const getUpcoming = (id: string) => upcoming.find((t) => t.id === id)!;
