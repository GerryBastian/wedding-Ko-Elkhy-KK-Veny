import { Church, Clock, MapPin, Navigation, Wine } from "lucide-react";
import { wedding } from "@/config/wedding";
import { directionsLink, mapsLink, safeEmbedUrl } from "@/lib/maps";
import { Florals } from "@/components/decor/Florals";
import { GoldFlourish, ScriptHeading } from "@/components/decor/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

const ICONS = { pemberkatan: Church, resepsi: Wine } as const;

/** Rangkaian acara + lokasi, dalam panel lengkung krem di atas beludru. */
export function Events() {
  return (
    <section id="acara" className="velvet overflow-hidden px-5 pb-24 pt-20">
      <Reveal>
        <ScriptHeading script="Rangkaian Acara" label="Simpan tanggalnya" tone="dark" />
        <p className="mt-4 text-center font-display text-[0.95rem] uppercase tracking-[0.4em] text-pearl/85">{wedding.dateLabel}</p>
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-14 max-w-md lg:max-w-4xl">
        <Florals variant="bouquet" className="absolute -left-14 -top-12 z-10 w-44 -scale-x-100 rotate-[-6deg] lg:w-56" />
        <Florals variant="bouquet" className="absolute -right-14 -top-12 z-10 w-44 rotate-[6deg] lg:w-56" />

        {/* Panel lengkung */}
        <div className="rounded-t-[999px] bg-gold p-[3px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] lg:rounded-t-[300px]">
          <div className="paper rounded-t-[999px] px-6 pb-12 pt-24 lg:rounded-t-[297px] lg:px-14">
            <div className="pointer-events-none absolute inset-[10px] rounded-t-[999px] border border-champagne/60 lg:rounded-t-[290px]" aria-hidden="true" />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-14">
              {wedding.events.map((event, i) => {
                const Icon = ICONS[event.key];
                const embed = safeEmbedUrl(event.mapsEmbedUrl);
                return (
                  <article key={event.key} className={`text-center ${i > 0 ? "border-t border-champagne/50 pt-12 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0" : ""}`}>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-burgundy-deep shadow-[0_8px_16px_-6px_rgb(110_70_20/0.6)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 font-script text-[3rem] leading-[1.25] text-burgundy">{event.title}</h3>
                    <p className="mt-1 flex items-center justify-center gap-2 font-display text-[0.8rem] uppercase tracking-[0.2em] text-ink/85">
                      <Clock className="h-3.5 w-3.5 text-rose" aria-hidden="true" />
                      {event.timeLabel}
                    </p>
                    <GoldFlourish className="mx-auto my-5 h-3 w-36" />
                    <p className="font-display text-xl leading-snug text-burgundy text-balance">{event.venue}</p>
                    <p className="mt-1.5 italic text-ink/70">{event.address}</p>

                    {embed && (
                      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden border border-champagne/60">
                        <iframe
                          src={embed}
                          title={`Peta lokasi ${event.venue}`}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 h-full w-full border-0 sepia-[20%]"
                        />
                      </div>
                    )}

                    <div className="mt-7 flex flex-col items-center gap-3">
                      <a href={directionsLink(event)} target="_blank" rel="noopener noreferrer" className="btn-notched">
                        <Navigation className="h-4 w-4" aria-hidden="true" />
                        Petunjuk Arah
                      </a>
                      <a
                        href={mapsLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-1.5 text-sm italic text-rose underline-offset-4 hover:underline"
                      >
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Lihat di Google Maps
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
