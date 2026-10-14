export type Answers = {
  workingOn: string;
  curiousAbout: string;
  lookingFor: string;
  wouldMeet: string;
  canOffer: string;
  sharing: "private" | "introductions";
};

export type Submission = {
  token: string;
  firstName: string;
  dinners: string[];
  answers: Answers;
};

// Where answers go. In production this is a small serverless endpoint
// (e.g. Supabase Edge Function) that stores the row and emails Michał.
// Without it (prototype) the submission is simulated.
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export async function submitConversation(data: Submission) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
}
