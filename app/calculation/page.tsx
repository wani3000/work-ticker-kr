import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "급여 계산 기준 | WORK TICKER", description: "연봉·월급·주급·일급·시급을 초당 급여로 환산하는 공식과 한계." };

const formulas = [
  ["연봉", "연봉 ÷ 12 ÷ 이번 달 반영 근무일 ÷ 하루 실근무 초"],
  ["월급", "월급 ÷ 이번 달 반영 근무일 ÷ 하루 실근무 초"],
  ["주급", "주급 ÷ 선택한 주당 근무일 ÷ 하루 실근무 초"],
  ["일급", "일급 ÷ 하루 실근무 초"],
  ["시급", "시급 ÷ 3,600초"],
];

export default function CalculationPage() {
  return <main className="content-shell"><SiteHeader /><article className="article-page content-width"><header><p className="eyebrow">CALCULATION STANDARD</p><h1>WORK TICKER의<br />급여 계산 기준</h1><p className="article-summary">일하는 동안 세전 급여가 어떻게 쌓이는지 보여주기 위한 생활 환산 공식입니다.</p><div className="byline"><span>기준 버전 2026.07</span><span>마지막 업데이트 2026-07-21</span></div></header><section><h2>급여 종류별 공식</h2><div className="formula-table">{formulas.map(([name, formula]) => <div key={name}><strong>{name}</strong><code>{formula}</code></div>)}</div></section><section><h2>하루 실근무시간</h2><p>출근부터 퇴근까지의 시간에서 사용자가 무급으로 설정한 휴게시간을 뺍니다. 휴게시간을 유급으로 설정하면 그 시간에도 카운터가 계속 올라갑니다.</p><p>퇴근시간이 출근시간보다 이르면 다음 날 퇴근하는 근무로 해석합니다. 예를 들어 22:00 출근, 07:00 퇴근은 9시간 범위의 야간근무로 계산합니다.</p></section><section><h2>근무일과 공휴일</h2><p>월급과 연봉은 현재 달력에서 선택한 근무 요일을 직접 셉니다. ‘2026년 대한민국 공휴일 제외’를 켜면 우주항공청 월력요항 등 공식 발표를 바탕으로 등록한 2026년 공휴일을 반영 근무일에서 제외합니다.</p><p>공휴일의 유급 여부와 실제 휴무 여부는 근로계약·취업규칙·사업장 적용 조건에 따라 다를 수 있으므로, 이 설정은 편의를 위한 달력 필터입니다.</p></section><section><h2>포함하지 않는 항목</h2><ul><li>근로소득세와 지방소득세</li><li>국민연금·건강보험·고용보험 등 공제</li><li>연장·야간·휴일근로 가산수당</li><li>주휴수당의 자동 판정</li><li>성과급·퇴직금·연차수당</li><li>통상임금 또는 평균임금에 대한 법적 판단</li></ul></section><section><h2>예시</h2><p>세전 월급 3,200,000원, 반영 근무일 22일, 하루 실근무 8시간이라면 하루 환산액은 약 145,455원, 시간당 약 18,182원, 초당 약 5.05원입니다. 해당 달의 근무일 수가 달라지면 같은 월급이라도 생활 환산 금액은 달라집니다.</p></section><aside className="legal-notice"><strong>실제 급여 판단과 다릅니다</strong><p>이 결과는 통상임금·최저임금·체불임금 계산서가 아닙니다. 법적 판단이 필요하면 근로계약서와 급여명세서를 준비해 고용노동부 고객상담센터 1350 또는 전문가에게 확인하세요.</p></aside><div className="article-actions"><Link href="/settings">내 기준 입력하기</Link><Link href="/guides/monthly-to-hourly">월급 환산 가이드</Link></div></article><SiteFooter /></main>;
}
