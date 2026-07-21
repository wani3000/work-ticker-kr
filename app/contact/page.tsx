import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "문의 및 오류 제보 | WORK TICKER", description: "계산 오류, 공식 자료 변경과 개인정보 관련 문의 방법." };

export default function ContactPage() { return <main className="content-shell"><SiteHeader /><section className="content-hero"><p className="eyebrow">CONTACT</p><h1>오류와 변경사항을<br />알려주세요.</h1><p>현재는 공개 저장소의 이슈를 공식 문의 채널로 사용합니다. 개인정보나 급여명세서 원본은 올리지 마세요.</p></section><section className="contact-grid content-width"><div><span>01</span><h2>계산 오류</h2><p>급여 종류, 근무시간, 휴게시간처럼 재현에 필요한 설정만 적어주세요. 실제 회사명과 개인 신상정보는 제외합니다.</p></div><div><span>02</span><h2>정보 수정</h2><p>변경된 법령·최저임금·공휴일을 발견했다면 공식 출처 링크와 함께 알려주세요.</p></div><div><span>03</span><h2>개인정보 문의</h2><p>광고·쿠키·데이터 처리와 관련된 질문에는 제목에 ‘개인정보 문의’를 표시해주세요.</p></div></section><div className="contact-action content-width"><a href="https://github.com/wani3000/work-ticker-kr/issues/new" target="_blank" rel="noreferrer">GitHub에서 문의 남기기 ↗</a><p>공개 문의가 곤란한 경우에는 개인 정보를 제거한 일반적인 질문만 남겨주세요. 전용 문의 이메일이 마련되면 이 페이지에 추가합니다.</p></div><SiteFooter /></main>; }
