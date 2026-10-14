import { notFound } from "next/navigation";
import { Experience } from "@/components/Experience";
import { dinners, getGuest, guestDinners, guests } from "@/data/dinners";

export const dynamicParams = false;

export function generateStaticParams() {
  return guests.map((g) => ({ token: g.token }));
}

export default async function GuestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const guest = getGuest(token);
  if (!guest) notFound();
  return <Experience guest={guest} mine={guestDinners(guest)} all={dinners} />;
}
