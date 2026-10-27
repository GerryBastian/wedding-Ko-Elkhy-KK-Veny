import type { PublicGuest } from "@/types";
import type { ExistingRsvp } from "@/lib/data";
import { safeListApprovedWishes } from "@/lib/data";
import { InvitationShell } from "./InvitationShell";
import { Hero } from "@/components/sections/Hero";
import { Couple } from "@/components/sections/Couple";
import { Invite } from "@/components/sections/Invite";
import { Events } from "@/components/sections/Events";
import { Gallery } from "@/components/sections/Gallery";
import { Rsvp } from "@/components/sections/Rsvp";
import { Wishes } from "@/components/sections/Wishes";
import { Families } from "@/components/sections/Families";
import { Closing } from "@/components/sections/Closing";

type Props = {
  guest: PublicGuest | null;
  existingRsvp?: ExistingRsvp | null;
};

/** Susunan lengkap undangan (Server Component). */
export async function Invitation({ guest, existingRsvp = null }: Props) {
  const wishes = await safeListApprovedWishes();

  return (
    <InvitationShell guestName={guest?.name ?? null}>
      <Hero />
      <Invite />
      <Couple />
      <Events />
      <Gallery />
      <Rsvp token={guest?.token ?? null} guestName={guest?.name ?? null} existing={existingRsvp} />
      <Wishes token={guest?.token ?? null} guestName={guest?.name ?? null} initialWishes={wishes} />
      <Families />
      <Closing />
    </InvitationShell>
  );
}
