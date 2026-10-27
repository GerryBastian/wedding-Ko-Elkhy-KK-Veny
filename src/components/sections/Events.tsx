import { Church, Clock, Navigation, Wine } from "lucide-react";
import { wedding } from "@/config/wedding";
import { directionsLink, safeEmbedUrl } from "@/lib/maps";
import { Florals } from "@/components/decor/Florals";
import { GoldFlourish, ScriptHeading } from "@/components/decor/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

const ICONS = { pemberkatan: Church, resepsi: Wine } as const;

/** Rangkaian acara + lokasi, dalam panel lengkung krem di atas beludru. */
export function Events() {
  return (
    <section id="acara" className="velvet overflow-hidden px-5 pb-16 pt-16">
      <Reveal>
        <ScriptHeading script="Rangkaian Acara" label="Simpan tanggalnya" tone="dark" />
        <p className="mt-3 text-center font-display text-[0.78rem] uppercase tracking-[0.22em] text-pearl/85 sm:text-[0.95rem] sm:tracking-[0.4em]">{wedding.dateLabel}</p>
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-12 max-w-md lg:max-w-4xl">
        <Florals variant="bouquet" className="absolute -left-14 -top-12 z-10 w-44 -scale-x-100 rotate-[-6deg] lg:w-56" />
        <Florals variant="bouquet" className="absolute -right-14 -top-12 z-10 w-44 rotate-[6deg] lg:w-56" />

        {/* Panel lengkung */}
        <div className="rounded-t-[999px] bg-gold p-[3px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] lg:rounded-t-[300px]">
          <div className="paper rounded-t-[999px] px-3 pb-8 pt-16 sm:px-6 lg:rounded-t-[297px] lg:px-14 lg:pb-10 lg:pt-20">
            <div className="pointer-events-none absolute inset-[10px] rounded-t-[999px] border border-champagne/60 lg:rounded-t-[290px]" aria-hidden="true" />

            {/* Kiri-kanan juga di HP agar ringkas */}
            <div className="relative grid grid-cols-2">
              {wedding.events.map((event, i) => {
                const Icon = ICONS[event.key];
                const embed = safeEmbedUrl(event.mapsEmbedUrl);
                return (
                  <article key={event.key} className={`flex flex-col items-center px-1.5 text-center sm:px-5 lg:px-8 ${i > 0 ? "border-l border-champagne/50" : ""}`}>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-burgundy-deep shadow-[0_8px_16px_-6px_rgb(110_70_20/0.6)] sm:h-14 sm:w-14">
                      <Icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-2 font-script text-[1.75rem] leading-[1.2] text-burgundy sm:text-[2.6rem] lg:text-[3rem]">{event.title}</h3>
                    <p className="mt-1.5 flex items-center justify-center gap-1 font-display text-[0.58rem] uppercase tracking-[0.1em] text-ink/85 sm:gap-2 sm:text-[0.8rem] sm:tracking-[0.2em]">
                      <Clock className="h-3 w-3 shrink-0 text-rose sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                      {event.timeLabel}
                    </p>
                    <GoldFlourish className="mx-auto my-3 h-3 w-24 sm:my-5 sm:w-36" />
                    <p className="font-display text-[0.95rem] leading-snug text-burgundy text-balance sm:text-xl">{event.venue}</p>
                    <p className="mt-1 text-[0.82rem] italic leading-snug text-ink/70 sm:text-base">{event.address}</p>

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

                    <div className="mt-auto flex flex-col items-center pt-5 sm:pt-7">
                      <a
                        href={directionsLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-notched min-h-10 gap-1 whitespace-nowrap px-2.5 py-2 text-[0.54rem] tracking-[0.08em] sm:min-h-12 sm:gap-2.5 sm:px-7 sm:text-[0.72rem] sm:tracking-[0.24em]"
                      >
                        <Navigation className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
                        Petunjuk Arah
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
