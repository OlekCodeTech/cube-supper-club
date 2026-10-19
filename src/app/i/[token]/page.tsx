import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/InvitationPage";
import { getInvitation, getUpcoming, invitations } from "@/data/invitations";

export const dynamicParams = false;

export function generateStaticParams() {
  return invitations.map((i) => ({ token: i.token }));
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = getInvitation(token);
  if (!invite) notFound();
  return <InvitationPage invite={invite} table={getUpcoming(invite.tableId)} />;
}
