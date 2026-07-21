import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "서비스 소개 | WORK TICKER", description: "WORK TICKER를 만든 이유와 편집 원칙." };

export default function AboutPage() { return <main className="content-shell"><SiteHeader /><article className="article-page content-width"><header><p className="eyebrow">ABOUT WORK TICKER</p><h1>시간의 가치를<br />눈앞의 숫자로.</h1><p className="article-summary">하루를 버티게 하는 월급이 지금 이 순간에도 쌓이고 있다는 사실을 직관적으로 보고 싶어서 만들었습니다.</p></header><section><h2>로그인 없는 실시간 급여 카운터</h2><p>WORK TICKER는 직장인, 아르바이트생, 프리랜서가 자신의 연봉·월급·주급·일급·시급을 근무시간에 맞춰 초 단위로 확인하는 도구입니다. 복잡한 회원가입 없이 사용하고, 급여 정보는 사용자의 기기에만 저장합니다.</p></section><section><h2>우리가 지키는 세 가지</h2><ul><li><strong>투명한 계산:</strong> 공식과 포함하지 않는 항목을 공개합니다.</li><li><strong>최소한의 데이터:</strong> 계산에 필요한 값을 자체 서버에 수집하지 않습니다.</li><li><strong>책임 있는 정보:</strong> 노동 관련 글은 공식 출처를 표시하고 법률 자문처럼 표현하지 않습니다.</li></ul></section><section><h2>작성자와 검토 방식</h2><p>서비스와 가이드는 WORK TICKER 운영팀·편집팀이 제작합니다. 국가법령정보센터, 고용노동부, 최저임금위원회, 우주항공청 등 공식 자료를 대조하고 각 글에 마지막 업데이트 날짜를 표시합니다.</p><p>현재 노무사 또는 변호사의 전문 감수를 받았다고 표시하지 않습니다. 전문가 검토가 완료되는 경우에만 검토자와 날짜를 투명하게 공개합니다.</p></section><section><h2>잘못된 정보를 발견했다면</h2><p>법령이나 공식 수치가 변경됐거나 계산 결과에 문제가 있다면 공개 문의 채널로 알려주세요. 재현 가능한 입력값과 근거 링크를 함께 남기면 더 빠르게 확인할 수 있습니다.</p></section><div className="article-actions"><Link href="/settings">카운터 시작하기</Link><Link href="/contact">문의하기</Link></div></article><SiteFooter /></main>; }
