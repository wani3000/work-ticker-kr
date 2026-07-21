import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "자주 묻는 질문 | WORK TICKER", description: "실시간 급여 카운터의 계산, 저장, 개인정보와 사용법 안내." };

const faqs = [
  ["입력한 월급이 서버로 전송되나요?", "아니요. 현재 급여와 근무시간은 브라우저의 localStorage에만 저장됩니다. 로그인과 자체 회원 데이터베이스를 사용하지 않습니다."],
  ["왜 실제 급여명세서와 금액이 다른가요?", "세금·4대 보험·주휴수당·가산수당과 회사별 임금 구성을 자동 판단하지 않는 세전 생활 환산이기 때문입니다."],
  ["점심시간에도 돈이 올라가요.", "설정에서 ‘휴게시간도 유급이에요’가 켜져 있는지 확인하세요. 무급으로 설정하면 해당 시간에는 카운터가 멈춥니다."],
  ["야간근무도 사용할 수 있나요?", "가능합니다. 퇴근시간을 출근시간보다 이르게 입력하면 다음 날 퇴근으로 계산합니다. 다만 야간근로 가산수당은 자동 적용하지 않습니다."],
  ["공휴일 제외가 정확한 법정 급여를 뜻하나요?", "아닙니다. 2026년 공식 달력 자료를 활용한 편의 설정입니다. 실제 유급휴일은 근로계약과 적용 법령에 따라 달라질 수 있습니다."],
  ["세후 실수령액도 계산하나요?", "현재는 지원하지 않습니다. 공제액은 개인별 조건이 달라 단순 입력만으로 정확하게 계산하기 어렵습니다."],
  ["왜 근무일이 달마다 달라지나요?", "월급과 연봉은 현재 달력에서 선택한 요일을 직접 세기 때문에 월별 평일 수와 공휴일에 따라 달라집니다."],
  ["결과를 임금체불 증거로 사용할 수 있나요?", "이 서비스는 법률 계산서가 아닙니다. 실제 출퇴근 기록, 계약서, 급여명세서 등 원자료를 보관하고 공식 상담을 이용하세요."],
];

export default function FaqPage() { return <main className="content-shell"><SiteHeader /><section className="content-hero"><p className="eyebrow">FAQ</p><h1>자주 묻는 질문</h1><p>계산 방식부터 개인정보까지, 사용 전 알아둘 내용을 모았습니다.</p></section><section className="faq-list content-width">{faqs.map(([q, a], index) => <details key={q} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{q}<b>＋</b></summary><p>{a}</p></details>)}</section><div className="center-action"><Link className="outline-button" href="/contact">해결되지 않았나요? 문의하기</Link></div><SiteFooter /></main>; }
