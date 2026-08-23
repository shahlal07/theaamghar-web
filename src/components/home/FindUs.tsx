import { MapPin, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

// Shown for any vendor that has both a business address and a Google Maps
// link set in Settings (business_settings.business_address /
// google_maps_url) -- quietly hidden otherwise, same convention as
// Delivery.tsx hiding when there's no shipping_zones coverage. The embed
// uses Google's no-API-key "output=embed" search form (keyed off the
// address text, not the maps link itself, since a maps.app.goo.gl short
// link can't be dropped straight into an iframe src) -- the "Get
// Directions" button is what actually opens the vendor's real Maps link.
export function FindUs({
  address,
  mapsUrl,
  city,
}: {
  address: string | null;
  mapsUrl: string | null;
  city?: string | null;
}) {
  if (!address || !mapsUrl) return null;

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <Section aria-label="Find us" className="bg-[var(--color-cream-warm)]">
      <Heading eyebrow="Find Us" title="Visit our spot" center className="mb-14" />
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 items-stretch">
        <div className="bg-white rounded-brand shadow-brand-sm p-8 flex flex-col justify-center">
          {city && (
            <span className="inline-flex items-center gap-1.5 w-fit bg-[var(--color-cream-warm)] text-[var(--color-mango-deep-text)] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {city}
            </span>
          )}
          <p className="font-serif text-xl font-bold text-[var(--color-mango-deep-text)] mb-1">{address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 w-fit mt-6 rounded-full font-semibold transition-colors duration-300 bg-[var(--color-orchard-green)] text-white px-6 py-3 text-sm hover:bg-[#256428]"
          >
            Get Directions
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
        </div>
        <div className="rounded-brand overflow-hidden shadow-brand-sm min-h-[320px]">
          <iframe
            title="Location map"
            src={embedSrc}
            className="w-full h-full min-h-[320px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
