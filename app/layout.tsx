import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://work-ticker-kr.wani3000.chatgpt.site";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const title = "지금, 얼마 벌었지? — WORK TICKER";
const description = "연봉·월급·주급·일급·시급과 근무시간을 입력하면 오늘 번 돈을 초 단위로 보여주는 로그인 없는 실시간 급여 카운터.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s" },
  description,
  applicationName: "WORK TICKER",
  robots: { index: true, follow: true },
  openGraph: { title, description, type: "website", siteName: "WORK TICKER", locale: "ko_KR", images: [{ url: "/og.png", width: 1200, height: 630, alt: "WORK TICKER 실시간 급여 카운터" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WORK TICKER",
  url: siteUrl,
  description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  author: { "@type": "Organization", name: "WORK TICKER 운영팀" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script id="work-ticker-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {adsenseClient && <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} />}
      </body>
    </html>
  );
}
