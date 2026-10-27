import { wedding } from "@/config/wedding";
import { GoldFlourish, ScriptHeading } from "@/components/decor/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

export function Families() {
  const groups = [
    { title: "Dari Mempelai Pria", items: wedding.families.groom },
    { title: "Dari Mempelai Wanita", items: wedding.families.bride },
  ];
  return (
    <section id="turut-mengundang" className="velvet overflow-hidden px-8 pb-10 pt-20 lg:pt-28">
      <Reveal>
        <ScriptHeading script="Turut Mengundang" tone="dark" />
      </Reveal>
      <div className="relative mx-auto mt-10 grid max-w-4xl gap-10 sm:grid-cols-2 sm:gap-16">
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.1} className="text-center">
            <p className="eyebrow text-champagne-soft/80">{g.title}</p>
            <GoldFlourish className="mx-auto my-3 h-3 w-32" />
            <ul className="space-y-1.5 text-[1.12rem] leading-snug text-pearl/90">
              {g.items.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
