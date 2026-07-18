import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://work-ticker-kr.wani3000.chatgpt.site";
const title = "지금, 얼마 벌었지? — 실시간 급여 카운터";
const description = "월급과 근무시간을 입력하면 오늘 번 돈을 초 단위로 보여주는 로그인 없는 급여 카운터.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "실시간 급여 카운터 미리보기" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
