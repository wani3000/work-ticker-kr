import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>WORK TICKER</strong>
        <p>일하는 시간을 돈의 흐름으로 보여주는 로그인 없는 급여 카운터.</p>
      </div>
      <div className="footer-links">
        <Link href="/calculation">계산 기준</Link>
        <Link href="/salary-converter">연봉계산기</Link>
        <Link href="/guides">근로 가이드</Link>
        <Link href="/faq">자주 묻는 질문</Link>
        <Link href="/sources">공식 출처</Link>
        <Link href="/privacy">개인정보처리방침</Link>
        <Link href="/terms">이용약관</Link>
        <Link href="/contact">문의</Link>
      </div>
      <p className="footer-note">일반적인 정보 제공을 위한 서비스이며 개별 근로계약에 대한 법률·세무 자문이 아닙니다.</p>
      <p className="copyright">© 2026 WORK TICKER 운영팀</p>
    </footer>
  );
}
