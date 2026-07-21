import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "공식 출처와 업데이트 정책 | WORK TICKER", description: "노동·급여 콘텐츠에 사용하는 공식 자료와 수정 원칙." };

const sources = [
  ["국가법령정보센터", "현행 법령과 시행령 확인", "https://www.law.go.kr/"],
  ["고용노동부", "임금·근로시간 정책과 공식 안내", "https://www.moel.go.kr/"],
  ["고용노동부 고객상담센터", "일반적인 노동 상담 안내", "https://1350.moel.go.kr/"],
  ["최저임금위원회", "연도별 최저임금 공식 수치", "https://www.minimumwage.go.kr/"],
  ["한국천문연구원 월력요항", "연도별 공휴일과 달력 기준", "https://astro.kasi.re.kr/life/post/almanac"],
];

export default function SourcesPage() { return <main className="content-shell"><SiteHeader /><article className="article-page content-width"><header><p className="eyebrow">SOURCES & UPDATES</p><h1>공식 출처와<br />업데이트 정책</h1><p className="article-summary">급여와 노동정보는 검색 결과나 다른 블로그가 아닌 원칙적으로 정부·공공기관의 원문을 우선 확인합니다.</p></header><section><h2>주요 출처</h2><div className="source-cards">{sources.map(([name, use, href]) => <a key={name} href={href} target="_blank" rel="noreferrer"><strong>{name}</strong><p>{use}</p><span>원문 보기 ↗</span></a>)}</div></section><section><h2>업데이트 원칙</h2><ul><li>연도별 최저임금과 공휴일은 새 공식 발표 확인 후 갱신합니다.</li><li>법률 설명이 바뀌면 해당 글의 업데이트 날짜를 변경합니다.</li><li>단순한 날짜 변경으로 새 글처럼 보이게 하지 않습니다.</li><li>정정이 계산 결과에 영향을 주면 관련 공식과 안내를 함께 수정합니다.</li><li>전문가 검토를 받지 않은 콘텐츠에 감수 표현을 사용하지 않습니다.</li></ul></section><section><h2>AI 보조 사용 공개</h2><p>초안 구성과 표현 정리에 자동화 도구가 사용될 수 있습니다. 운영팀은 공개 전 공식 출처와 계산 로직을 대조하며, 자동 생성 결과를 법률 자문이나 전문가 의견으로 표시하지 않습니다.</p></section><aside className="legal-notice"><strong>기준일</strong><p>현재 콘텐츠 기준일은 2026년 7월 21일입니다. 변경 제보는 문의 페이지의 공개 채널로 받을 수 있습니다.</p></aside></article><SiteFooter /></main>; }
