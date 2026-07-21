import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { guides } from "./content";

export const metadata: Metadata = { title: "급여·근로 가이드 | WORK TICKER", description: "실시간 급여 계산과 연결되는 근로시간, 휴게시간, 주휴수당, 최저임금 안내." };

export default function GuidesPage() {
  return <main className="content-shell"><SiteHeader /><section className="content-hero"><p className="eyebrow">WORK & PAY GUIDE</p><h1>일하는 시간과<br />급여를 이해하는 법</h1><p>계산기 입력값과 바로 연결되는 기본 정보만 공식 출처를 바탕으로 정리했습니다.</p></section><section className="article-list content-width">{guides.map((guide) => <Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.index}</span><div><h2>{guide.title}</h2><p>{guide.summary}</p><small>{guide.readTime} 읽기 · 업데이트 {guide.updated}</small></div><b>↗</b></Link>)}</section><section className="editorial-note content-width"><strong>편집 원칙</strong><p>법령 문구를 복사해 나열하지 않고, 계산기를 사용하는 사람이 실제로 이해해야 할 차이를 설명합니다. WORK TICKER 편집팀이 공식 자료를 확인해 작성하며, 변경이 확인되면 날짜와 내용을 갱신합니다.</p></section><SiteFooter /></main>;
}
