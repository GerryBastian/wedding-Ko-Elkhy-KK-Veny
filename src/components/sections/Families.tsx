import { ChevronDown } from "lucide-react";
import { wedding } from "@/config/wedding";
import { GoldFlourish } from "@/components/decor/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

/** Turut mengundang — dilipat agar tamu tidak perlu scroll panjang. */
export function Families() {
  const groups = [
    { title: "Dari Mempelai Pria", items: wedding.families.groom },
    { title: "Dari Mempelai Wanita", items: wedding.families.bride },
  ];
  return (
    <section id="turut-mengundang" className="velvet overflow-hidden px-6 pb-4 pt-12">
      <Reveal className="mx-auto max-w-3xl">
        <details className="group">
          <summary className="mx-auto flex w-fit cursor-pointer list-none flex-col items-center gap-1 text-center [&::-webkit-details-marker]:hidden">
            <span className="font-script text-[2.6rem] leading-tight text-gold">Turut Mengundang</span>
            <span className="flex items-center gap-1.5 font-display text-[0.62rem] uppercase tracking-[0.3em] text-champagne-soft/80">
              <span className="group-open:hidden">Lihat daftar keluarga</span>
              <span className="hidden group-open:inline">Tutup daftar</span>
              <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
            </span>
          </summary>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-14">
            {groups.map((g) => (
              <div key={g.title} className="text-center">
                <p className="eyebrow text-champagne-soft/80">{g.title}</p>
                <GoldFlourish className="mx-auto my-3 h-3 w-32" />
                <ul className="space-y-1 text-[1.05rem] leading-snug text-pearl/90">
                  {g.items.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </Reveal>
    </section>
  );
}
