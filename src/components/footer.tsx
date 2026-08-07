import Link from "next/link";
import Image from "next/image";
import type { Tables } from "@/lib/supabase/types";
import type { SiteContent } from "@/lib/queries/site-content";
import { WhatsAppIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YouTubeIcon } from "@/components/contact-icons";
import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";

const SOCIAL_LINKS = [
  { key: "facebook_url", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram_url", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok_url", label: "TikTok", Icon: TikTokIcon },
  { key: "twitter_url", label: "X (Twitter)", Icon: XIcon },
  { key: "youtube_url", label: "YouTube", Icon: YouTubeIcon },
] as const;

export function Footer({
  settings,
  content,
}: {
  settings: Tables<"public_business_settings"> | null;
  content: SiteContent;
}) {
  const businessName = settings?.business_name ?? content.brand.logoText;
  const socialLinks = settings
    ? SOCIAL_LINKS.filter((s) => settings[s.key])
    : [];

  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-[5%] py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2">
            {content.brand.logoImageUrl ? (
              <Image
                src={content.brand.logoImageUrl}
                alt={content.brand.logoText}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="w-6 h-6 bg-mango-orange inline-block rounded-[50%_50%_50%_5px]"
              />
            )}
            {content.brand.logoText}
          </Link>
          <p className="text-sm text-white/60 mt-3">{content.footer.tagline}</p>

          {socialLinks.length > 0 && (
            <div className="mt-5">
              <h4 className="font-semibold mb-2.5 text-sm">Follow Us</h4>
              <div className="flex gap-2.5">
                {socialLinks.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={settings![key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${businessName} on ${label}`}
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-mango-orange hover:border-mango-orange transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/#shop">All Varieties</Link>
            <Link href="/wishlist">Wishlist</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/#story">Our Story</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link href="/track">Track Order</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/report-bug">Report a Bug</Link>
            {settings?.support_whatsapp && (
              <a
                href={generalInquiryWhatsAppLink(settings.support_whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-mango-orange"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                WhatsApp Us
              </a>
            )}
            {settings?.support_phone && (
              <a href={`tel:${settings.support_phone}`} className="flex items-center gap-2 hover:text-mango-orange">
                <PhoneIcon className="w-4 h-4 shrink-0" />
                {settings.support_phone}
              </a>
            )}
            {settings?.support_email && (
              <a href={`mailto:${settings.support_email}`} className="flex items-center gap-2 hover:text-mango-orange">
                <MailIcon className="w-4 h-4 shrink-0" />
                {settings.support_email}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/50 py-5">
        &copy; {new Date().getFullYear()} {businessName}. {content.footer.copyrightSuffix}
      </div>
    </footer>
  );
}
