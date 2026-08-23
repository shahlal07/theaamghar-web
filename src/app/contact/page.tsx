import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { getActiveFaqs } from "@/lib/queries/faq";
import {
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/contact-icons";
import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";

const SOCIAL_LINKS = [
  { key: "facebook_url", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram_url", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok_url", label: "TikTok", Icon: TikTokIcon },
  { key: "twitter_url", label: "X (Twitter)", Icon: XIcon },
  { key: "youtube_url", label: "YouTube", Icon: YouTubeIcon },
] as const;

export default async function ContactPage() {
  const [{ settings }, content, faqs] = await Promise.all([
    getSiteChrome(),
    getSiteContent(),
    getActiveFaqs(),
  ]);
  const socialLinks = settings ? SOCIAL_LINKS.filter((s) => settings[s.key]) : [];
  const FAQS = faqs.length > 0 ? faqs.map((f) => ({ q: f.question, a: f.answer })) : content.faqFallback.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <div className="px-[5%] py-10 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-bold mb-2">Get in Touch</h1>
      <p className="text-ink-light mb-10">
        Questions about freshness, delivery, or bulk/corporate gifting — we&apos;re happy to
        help.
      </p>

      <div className="grid gap-4">
        {settings?.support_whatsapp && (
          <a
            href={generalInquiryWhatsAppLink(settings.support_whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-border-subtle rounded-brand p-5 hover:border-mango-orange"
          >
            <WhatsAppIcon className="w-7 h-7 text-[#25D366] shrink-0" />
            <div>
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm text-ink-light">Fastest way to reach us</div>
            </div>
          </a>
        )}
        {settings?.support_phone && (
          <a
            href={`tel:${settings.support_phone}`}
            className="flex items-center gap-4 border border-border-subtle rounded-brand p-5 hover:border-mango-orange"
          >
            <PhoneIcon className="w-7 h-7 text-mango-orange shrink-0" />
            <div>
              <div className="font-semibold">{settings.support_phone}</div>
              <div className="text-sm text-ink-light">Call us directly</div>
            </div>
          </a>
        )}
        {settings?.support_email && (
          <a
            href={`mailto:${settings.support_email}`}
            className="flex items-center gap-4 border border-border-subtle rounded-brand p-5 hover:border-mango-orange"
          >
            <MailIcon className="w-7 h-7 text-mango-orange shrink-0" />
            <div>
              <div className="font-semibold">{settings.support_email}</div>
              <div className="text-sm text-ink-light">Email us anytime</div>
            </div>
          </a>
        )}
        {settings?.business_address && (
          <div className="flex items-center gap-4 border border-border-subtle rounded-brand p-5">
            <LocationIcon className="w-7 h-7 text-mango-orange shrink-0" />
            <div>
              <div className="font-semibold">{settings.business_address}</div>
              <div className="text-sm text-ink-light">Find us here</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl font-bold mb-1">Frequently Asked Questions</h2>
        <p className="text-ink-light text-sm mb-5">
          Can&apos;t find your answer? Our chat assistant (bottom-left) or WhatsApp are always
          faster.
        </p>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group border border-border-subtle rounded-brand-sm px-4 py-3"
            >
              <summary className="font-semibold text-sm cursor-pointer flex items-center justify-between gap-3 list-none">
                {faq.q}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  className="shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="text-sm text-ink-light mt-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-10 text-center">
          <div className="text-sm font-semibold text-ink-light mb-3">Follow Us</div>
          <div className="flex justify-center gap-3">
            {socialLinks.map(({ key, label, Icon }) => (
              <a
                key={key}
                href={settings![key]!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings?.business_name ?? content.brand.logoText} on ${label}`}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-ink-light hover:text-mango-orange hover:border-mango-orange transition-colors"
              >
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
