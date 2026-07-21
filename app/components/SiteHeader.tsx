import Link from "next/link";

export default function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "compact" : ""}`}>
      <Link className="brand-lockup brand-link" href="/settings" aria-label="급여 정보 입력 페이지로 이동">
        <span className="brand-mark" aria-hidden="true">₩</span>
        <span>WORK TICKER</span>
      </Link>
      <nav aria-label="주요 메뉴">
        <Link href="/">카운터</Link>
        <Link href="/salary-converter">연봉계산기</Link>
        <Link href="/guides">가이드</Link>
        <Link href="/about">소개</Link>
      </nav>
    </header>
  );
}
