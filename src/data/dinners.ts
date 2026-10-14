// Cube Supper Club — dinners and returning guests.
//
// PROTOTYPE DATA. Dates, venues and lines are placeholders until Michał
// confirms them. `photo`:
//   - "/photos/table-03.jpg" → real group photo (drop the file into /public/photos)
//   - "pending"              → photo exists but has not been supplied yet (placeholder frame)
//   - null                   → no group photo was taken (typographic card by design)

export type Dinner = {
  id: string;
  number: number;
  date: string; // ISO
  venue: string;
  city: string;
  photo: string | "pending" | null;
  /** One discreet editorial line about the evening. */
  line: string;
};

export type Guest = {
  /** Unguessable token used in the personal link: /t/<token>/ */
  token: string;
  firstName: string;
  dinners: string[]; // Dinner ids, any order
  /** Optional private note from Michał, shown in "Your Table". */
  note?: string;
};

export const dinners: Dinner[] = [
  { id: "t01", number: 1, date: "2024-01-18", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "The first table. Ten strangers and a long winter evening." },
  { id: "t02", number: 2, date: "2024-03-07", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "An evening that started with travel and ended with ideas." },
  { id: "t03", number: 3, date: "2024-05-16", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "Late spring, open windows, conversations that ran past midnight." },
  { id: "t04", number: 4, date: "2024-07-11", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "A summer table of makers, hosts and storytellers." },
  { id: "t05", number: 5, date: "2024-09-26", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "The table where hospitality met fashion." },
  { id: "t06", number: 6, date: "2024-11-21", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "Candles, rain outside and a very long dessert." },
  { id: "t07", number: 7, date: "2025-02-13", venue: "Ham Yard Hotel", city: "London", photo: null, line: "No photograph was taken that night. Only the conversations remain." },
  { id: "t08", number: 8, date: "2025-05-22", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "A table of first meetings and second chances." },
  { id: "t09", number: 9, date: "2025-09-18", venue: "Ham Yard Hotel", city: "London", photo: "pending", line: "The most recent table, and certainly not the last." },
];

export const guests: Guest[] = [
  {
    token: "k7q2m9xa4d",
    firstName: "Sarah",
    dinners: ["t04"],
    note: "You started the conversation about slow travel. By dessert, the whole table had joined in.",
  },
  {
    token: "r3v8n1pz6e",
    firstName: "James",
    dinners: ["t02", "t05", "t08"],
  },
  {
    token: "w5h9c4tb2y",
    firstName: "Anna",
    dinners: ["t07"],
  },
];

export function getGuest(token: string) {
  return guests.find((g) => g.token === token);
}

export function guestDinners(guest: Guest) {
  return dinners
    .filter((d) => guest.dinners.includes(d.id))
    .sort((a, b) => a.date.localeCompare(b.date));
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
export const roman = (n: number) => ROMAN[n] ?? String(n);

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
