import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { guides } from "../content";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  return guide ? { title: `${guide.title} | WORK TICKER`, description: guide.summary } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <main className="content-shell"><SiteHeader /><article className="article-page content-width"><div className="article-breadcrumb"><Link href="/guides">급여·근로 가이드</Link><span>/</span><span>{guide.index}</span></div><header><p className="eyebrow">GUIDE / {guide.index}</p><h1>{guide.title}</h1><p className="article-summary">{guide.summary}</p><div className="byline"><span>작성 WORK TICKER 편집팀</span><span>검토 공식 출처 대조</span><span>업데이트 {guide.updated}</span></div></header>{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((p) => <p key={p}>{p}</p>)}{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}<aside className="legal-notice"><strong>꼭 확인하세요</strong><p>이 글은 일반적인 정보 제공을 위한 편집 콘텐츠이며 개별 사건에 대한 법률 자문이 아닙니다. 실제 임금은 근로계약, 사업장 규모, 임금 구성과 근무제도에 따라 달라질 수 있습니다.</p></aside><section className="sources"><h2>공식 출처</h2>{guide.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</section><div className="article-actions"><Link href="/settings">내 급여 입력하기</Link><Link href="/guides">다른 가이드 보기</Link></div></article><SiteFooter /></main>;
}
