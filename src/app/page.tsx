import { Invitation } from "@/components/invitation/Invitation";

// Daftar ucapan diperbarui berkala
export const revalidate = 60;

export default function HomePage() {
  return <Invitation guest={null} />;
}
