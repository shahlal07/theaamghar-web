import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CompareProvider } from "@/lib/compare-context";
import { ToastProvider } from "@/lib/toast-context";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent, DEFAULT_SITE_CONTENT } from "@/lib/queries/site-content";
import type { SiteContent } from "@/lib/queries/site-content";
import { SITE_URL } from "@/lib/site-url";
import { Navbar } from "@/components/navbar";
import { ConditionalFooter } from "@/components/conditional-footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CompareBar } from "@/components/compare-bar";
import { BackToTopButton } from "@/components/back-to-top-button";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { FloatingCartFab } from "@/components/floating-cart-fab";
import { NavigationLoadingOverlay } from "@/components/navigation-loading-overlay";
import { ReferralCapture } from "@/components/referral-capture";

// Both files are variable fonts (a single woff2 covers the weight range),
// ported as-is from ../Theaamghar/fonts/ -- see that project's fonts.css
// for the original static @font-face setup this replaces.
const inter = localFont({
  src: "../fonts/inter-normal-260c81a4.woff2",
  variable: "--font-inter",
  weight: "300 700",
  display: "swap",
});

const cormorantGaramond = localFont({
  src: [
    {
      path: "../fonts/cormorant-garamond-normal-c47ff128.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/cormorant-garamond-italic-aa6bdaf5.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

// Dynamic (not a static `export const metadata`) so the title/description/OG
// tags come from the admin-editable site_content row -- see
// src/lib/queries/site-content.ts. Falls back to the same real copy either
// way, since getSiteContent() always merges over DEFAULT_SITE_CONTENT.
export async function generateMetadata(): Promise<Metadata> {
  const { siteMeta, brand } = await getSiteContent();
  return {
    // metadataBase makes every relative OG/canonical URL below resolve to an
    // absolute one -- without it Next emits relative og:image paths, which
    // WhatsApp/Facebook silently refuse to render.
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteMeta.defaultTitle,
      // Child pages set just their own title; this appends the brand.
      template: siteMeta.titleTemplate,
    },
    description: siteMeta.defaultDescription,
    applicationName: brand.logoText,
    openGraph: {
      type: "website",
      siteName: brand.logoText,
      title: siteMeta.defaultTitle,
      description: siteMeta.defaultDescription,
      locale: "en_PK",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteMeta.defaultTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteMeta.defaultTitle,
      description: siteMeta.defaultDescription,
    },
  };
}

// Renders the admin-editable palette as a `:root` override that cascades
// after globals.css's own `:root` defaults (equal specificity, later wins).
// Every Tailwind utility (bg-mango-orange, text-mango-orange, ...) reads
// these custom properties live via globals.css's `@theme inline` block, so
// overriding them here re-colors every structural usage sitewide with no
// Tailwind config changes. Hex values are validated (falling back to the
// real default per-key) since this is server-rendered content interpolated
// directly into a <style> tag -- never trust the DB row's raw string here,
// even though the admin Server Action already validates on write.
function brandColorsStyle(colors: SiteContent["brandColors"]): string {
  const HEX = /^#[0-9a-f]{6}$/i;
  const d = DEFAULT_SITE_CONTENT.brandColors;
  const safe = (value: string, fallback: string) => (HEX.test(value) ? value : fallback);
  return `:root{--color-mango-orange:${safe(colors.primary, d.primary)};--color-mango-deep:${safe(colors.primaryDeep, d.primaryDeep)};--color-orchard-green:${safe(colors.secondary, d.secondary)};--color-orchard-light:${safe(colors.secondaryLight, d.secondaryLight)};--color-golden:${safe(colors.accent, d.accent)};}`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ vendor, settings }, content] = await Promise.all([getSiteChrome(), getSiteContent()]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable}`}
      // The beforeInteractive theme-init script below sets data-theme on
      // this element directly (outside React's own render) before
      // hydration -- that's a real, by-design mismatch between server and
      // client markup, not a bug. suppressHydrationWarning is the
      // documented way to tell React to ignore it on this one element.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink antialiased">
        {/* Server-rendered, so no flash-of-default-color risk the way the
            client-side theme script below needs beforeInteractive for. */}
        <style>{brandColorsStyle(content.brandColors)}</style>
        {/* Applies a saved theme before first paint to avoid a flash of the
            wrong theme -- must run beforeInteractive, same reasoning as the
            inline <head> script in every ../Theaamghar/*.html page. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('od_theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Suspense fallback={null}>
          <ReferralCapture />
        </Suspense>
        <ToastProvider>
          <CartProvider>
            <CompareProvider>
              <Navbar brand={content.brand} />
              <main id="main" className="flex-1 pt-[var(--nav-height)] pb-16 md:pb-0">
                {children}
              </main>
              <ConditionalFooter settings={settings} content={content} />
              <CartSidebar content={content.emptyStates} />
              <MobileTabBar />
              <WhatsAppButton whatsappNumber={settings?.support_whatsapp ?? vendor?.whatsapp_number ?? null} />
              <AIChatWidget whatsappNumber={settings?.support_whatsapp ?? vendor?.whatsapp_number ?? null} />
              <FloatingCartFab />
              <CompareBar />
              <BackToTopButton />
              <NavigationLoadingOverlay />
            </CompareProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
