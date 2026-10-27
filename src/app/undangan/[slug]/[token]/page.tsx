import type { Metadata } from "next";
import { wedding } from "@/config/wedding";
import { getGuestByToken, getRsvpForGuest } from "@/lib/data";
import { Invitation } from "@/components/invitation/Invitation";
import { InvitationUnavailable } from "@/components/invitation/InvitationUnavailable";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string; token: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, token } = await params;
  const guest = slug === wedding.slug ? await getGuestByToken(slug, token).catch(() => null) : null;
  return {
    title: guest
      ? `Untuk ${guest.name} — The Wedding of ${wedding.groom.nickname} & ${wedding.bride.nickname}`
      : `The Wedding of ${wedding.groom.nickname} & ${wedding.bride.nickname}`,
    robots: { index: false, follow: false },
  };
}

export default async function PersonalInvitationPage({ params }: Params) {
  const { slug, token } = await params;
  if (slug !== wedding.slug) return <InvitationUnavailable />;

  let guest = null;
  try {
    guest = await getGuestByToken(slug, token.toLowerCase());
  } catch (err) {
    console.error("[undangan] gagal memvalidasi token:", err);
    return <InvitationUnavailable reason="error" />;
  }
  if (!guest) return <InvitationUnavailable />;

  const existingRsvp = await getRsvpForGuest(guest.id).catch(() => null);
  return <Invitation guest={guest} existingRsvp={existingRsvp} />;
}
