import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Guide de voyage : destinations, conseils & comparateurs`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", site: siteConfig.twitter },
  icons: { icon: "/favicon.ico" },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={siteConfig.lang} suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Aller au contenu
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>

        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        {/* Google Analytics 4 (chargé après interaction — préserve le LCP) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');`}
            </Script>
          </>
        )}

        {/* Google AdSense (chargé après interaction) */}
        {siteConfig.ads.enabled && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.ads.client}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
