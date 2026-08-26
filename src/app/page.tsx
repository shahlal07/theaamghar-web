import { getPublishedProducts } from "@/lib/queries/products";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { getTopReviews } from "@/lib/queries/reviews";
import { getDeliveryCoverage } from "@/lib/queries/shipping-server";
import { getActiveFaqs } from "@/lib/queries/faq";
import { HeroSection } from "@/components/hero-section";
import { Reveal } from "@/components/reveal";
import { LazyVideo } from "@/components/lazy-video";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Story } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { Delivery } from "@/components/home/Delivery";
import { FindUs } from "@/components/home/FindUs";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YouTubeIcon } from "@/components/contact-icons";
import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";

const SOCIAL_LINKS = [
  { key: "facebook_url", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram_url", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok_url", label: "TikTok", Icon: TikTokIcon },
  { key: "twitter_url", label: "X (Twitter)", Icon: XIcon },
  { key: "youtube_url", label: "YouTube", Icon: YouTubeIcon },
] as const;

export default async function Home() {
  const [products, { settings }, content, topReviews, deliveryCoverage, faqs] = await Promise.all([
    getPublishedProducts(),
    getSiteChrome(),
    getSiteContent(),
    getTopReviews(),
    getDeliveryCoverage(),
    getActiveFaqs(),
  ]);

  return (
    <div>
      <HeroSection
        videoSrc={content.hero.desktopVideoUrl}
        mobileVideoSrc={content.hero.mobileVideoUrl}
        mobileImageSrc={content.hero.mobileImageUrl}
        desktopImageSrc={content.hero.desktopImageUrl}
        mobileOnly={content.hero.mobileOnly}
        accentEmoji={content.brand.accentEmoji}
        title={
          <>
            {content.hero.headlineLine1}
            <br />
            <em className="text-mango-orange not-italic">{content.hero.headlineLine2}</em>
          </>
        }
        subtitle={content.hero.subheadline}
      >
        <div className="flex items-center justify-center gap-4">
          <Button href="#shop" variant="primary">
            {content.hero.ctaPrimaryText}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Button>
          <Button href="#story" variant="outline">
            {content.hero.ctaSecondaryText}
          </Button>
        </div>
      </HeroSection>

      <TrustBar items={content.trustBar.items} />

      <div id="shop" className="scroll-mt-24">
        <FeaturedCollection
          products={products}
          whatsappNumber={settings?.support_whatsapp}
          whatsappTemplate={settings?.whatsapp_order_message_template}
          content={content.featuredCollection}
        />
      </div>

      <WhyChooseUs content={content.whyChooseUs} />

      <Story content={content.story} />

      <Testimonials reviews={topReviews} />

      <Delivery coverage={deliveryCoverage} content={content.delivery} />

      <FindUs address={settings?.business_address ?? null} mapsUrl={settings?.google_maps_url ?? null} />

      <FAQ faqs={faqs.length > 0 ? faqs : content.faqFallback} />

      <section aria-label="Freshness promise and contact" className="px-[5%] py-16 bg-[var(--color-cream-warm)]">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 md:items-center mb-12">
          <Reveal>
            <LazyVideo
              src={content.storyBanner.videoUrl}
              mobileVideoSrc={content.storyBanner.mobileVideoUrl}
              desktopImageSrc={content.storyBanner.desktopImageUrl}
              mobileImageSrc={content.storyBanner.mobileImageUrl}
              mobileOnly={content.storyBanner.mobileOnly}
              className="w-full rounded-brand shadow-brand-sm aspect-[4/5]"
            />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-[var(--color-mango-deep)]">
              {content.storyBanner.heading}
            </h2>
            <p className="text-[var(--color-ink)]/75">{content.storyBanner.body}</p>
          </Reveal>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="grid sm:grid-cols-3 gap-4">
              {settings?.support_whatsapp && (
                <a
                  href={generalInquiryWhatsAppLink(settings.support_whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 bg-white border border-[var(--color-mango-deep)]/10 rounded-2xl p-5 shadow-brand-sm hover:-translate-y-1 hover:shadow-brand-md hover:border-[var(--color-golden)]/50 active:translate-y-0 active:scale-95 transition-all"
                >
                  <WhatsAppIcon className="w-7 h-7 text-[#25D366]" />
                  <span className="font-semibold text-sm text-[var(--color-mango-deep)]">WhatsApp Us</span>
                  <span className="text-xs text-[var(--color-ink)]/60">Usually replies in minutes</span>
                </a>
              )}
              {settings?.support_phone && (
                <a
                  href={`tel:${settings.support_phone}`}
                  className="flex flex-col items-center gap-2 bg-white border border-[var(--color-mango-deep)]/10 rounded-2xl p-5 shadow-brand-sm hover:-translate-y-1 hover:shadow-brand-md hover:border-[var(--color-golden)]/50 active:translate-y-0 active:scale-95 transition-all"
                >
                  <PhoneIcon className="w-7 h-7 text-[var(--color-mango-deep-text)]" />
                  <span className="font-semibold text-sm text-[var(--color-mango-deep)]">{settings.support_phone}</span>
                  <span className="text-xs text-[var(--color-ink)]/60">Call us directly</span>
                </a>
              )}
              {settings?.support_email && (
                <a
                  href={`mailto:${settings.support_email}`}
                  className="flex flex-col items-center gap-2 bg-white border border-[var(--color-mango-deep)]/10 rounded-2xl p-5 shadow-brand-sm hover:-translate-y-1 hover:shadow-brand-md hover:border-[var(--color-golden)]/50 active:translate-y-0 active:scale-95 transition-all"
                >
                  <MailIcon className="w-7 h-7 text-[var(--color-mango-deep-text)]" />
                  <span className="font-semibold text-sm text-[var(--color-mango-deep)]">{settings.support_email}</span>
                  <span className="text-xs text-[var(--color-ink)]/60">Email anytime</span>
                </a>
              )}
            </div>
          </Reveal>

          {settings && SOCIAL_LINKS.some((s) => settings[s.key]) && (
            <Reveal delay={100} className="mt-10">
              <div className="text-sm font-semibold text-[var(--color-ink)]/60 mb-3">Follow Us</div>
              <div className="flex justify-center gap-3">
                {SOCIAL_LINKS.filter((s) => settings[s.key]).map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={settings[key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.business_name ?? "TheAamGhar"} on ${label}`}
                    className="w-10 h-10 rounded-full border border-[var(--color-mango-deep)]/15 flex items-center justify-center text-[var(--color-ink)]/60 hover:text-[var(--color-mango-deep-text)] hover:border-[var(--color-mango-deep)] hover:-translate-y-0.5 active:translate-y-0 active:scale-90 transition-all"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <Newsletter content={content.newsletter} />
    </div>
  );
}
