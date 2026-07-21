"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SiteFooter from "./components/SiteFooter";
import { DAYS, DEFAULTS, LEGACY_STORAGE_KEY, PAY_TYPES, STORAGE_KEY, Settings, getMetrics, normalizeSettings } from "./settings-data";

function formatWon(value: number, decimals = 0) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.max(0, value));
}

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [now, setNow] = useState(() => new Date());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next = DEFAULTS;
    let shouldRedirect = false;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) next = normalizeSettings(JSON.parse(saved));
      else shouldRedirect = true;
    } catch {
      // 손상된 로컬 데이터는 안전한 기본값으로 대체합니다.
    }
    const frame = window.requestAnimationFrame(() => {
      setSettings(next);
      setReady(true);
      if (shouldRedirect) router.replace("/settings");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 100);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => getMetrics(now, settings), [now, settings]);
  const payType = PAY_TYPES.find((item) => item.value === settings.payType)!;
  const monthLabel = `${now.getMonth() + 1}월`;
  const dateLabel = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(now);
  const timeLabel = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
  const daysLabel = DAYS.filter((day) => settings.workDays.includes(day.value)).map((day) => day.label).join("·");

  const status = metrics.isLunch
    ? "휴게시간 · 카운터 멈춤"
    : metrics.isDone
      ? "오늘 근무 완료"
      : metrics.excludedHoliday
        ? "오늘은 공휴일로 제외했어요"
        : !metrics.isWorkday
          ? "오늘은 선택한 근무 요일이 아니에요"
          : metrics.isWorking
            ? "지금도 쌓이는 중"
            : "아직 근무시간 전이에요";

  return (
    <main className="app-shell home-shell">
      <section className="payslip" aria-live="polite">
        <header className="topbar">
          <Link className="brand-lockup brand-link" href="/settings" aria-label="급여 정보 입력 페이지로 이동">
            <span className="brand-mark" aria-hidden="true">₩</span>
            <span>WORK TICKER</span>
          </Link>
          <time dateTime={now.toISOString()}>{timeLabel}</time>
        </header>

        <div className="intro">
          <p className="eyebrow">오늘의 실시간 세전 급여</p>
          <h1>지금, 얼마<br />벌었지?</h1>
          <p className="today">{dateLabel}</p>
        </div>

        <section className="earnings-block" aria-label="오늘 번 금액">
          <div className="status-line"><span className={`live-dot ${metrics.isWorking ? "is-live" : ""}`} /><span>{status}</span></div>
          <p className="earnings" data-testid="earned-amount">{ready ? formatWon(metrics.earned, 2) : "₩0.00"}</p>
          <div className="rate-row"><span>1초마다</span><strong>{formatWon(metrics.perSecond, 2)}</strong></div>
        </section>

        <section className="quick-rates" aria-label="급여 환산 결과">
          <div><span>1분</span><strong>{formatWon(metrics.perMinute)}</strong></div>
          <div><span>1시간</span><strong>{formatWon(metrics.perHour)}</strong></div>
          <div><span>오늘 남은 금액</span><strong>{formatWon(metrics.remaining)}</strong></div>
        </section>

        <section className="progress-section" aria-label="오늘 근무 진행률">
          <div className="progress-heading"><span>WORKDAY PROGRESS</span><strong>{Math.round(metrics.progress * 100)}%</strong></div>
          <div className="progress-track"><span style={{ width: `${metrics.progress * 100}%` }} /></div>
          <div className="progress-times"><span>{settings.workStart}</span><span>휴게 {settings.lunchStart}—{settings.lunchEnd} · {settings.lunchPaid ? "유급" : "무급"}</span><span>{settings.workEnd}</span></div>
        </section>

        <section className="details" aria-label="급여 계산 설정">
          <div className="detail-title"><span>PAY SLIP / {monthLabel}</span><Link href="/settings">수정하기</Link></div>
          <dl>
            <div><dt>{payType.label} (세전)</dt><dd>{formatWon(settings.amount)}</dd></div>
            <div><dt>근무시간</dt><dd>{settings.workStart} — {settings.workEnd}</dd></div>
            <div><dt>근무 요일</dt><dd>{daysLabel}</dd></div>
            <div><dt>이번 달 반영 근무일</dt><dd>{metrics.monthlyWorkdays}일</dd></div>
            <div><dt>월 환산</dt><dd>{formatWon(metrics.monthlyEquivalent)}</dd></div>
            <div className="total"><dt>하루 환산</dt><dd>{formatWon(metrics.dailyPay)}</dd></div>
          </dl>
        </section>

        <section className="formula-card">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>이 금액은 어떻게 계산했나요?</h2>
          <p>{payType.label}을 실제 근무시간으로 환산하고, 선택한 근무 요일과 {settings.excludePublicHolidays ? "2026년 공휴일 제외 기준" : "공휴일 포함 기준"}을 적용했습니다. 무급 휴게시간에는 금액이 올라가지 않습니다.</p>
          <p className="formula-example">{formatWon(settings.amount)} ÷ 근무 기준 → 초당 {formatWon(metrics.perSecond, 2)}</p>
          <Link className="text-link" href="/calculation">전체 계산 기준과 한계 보기 →</Link>
        </section>

        <footer className="ticker-footer"><span>로그인 없이</span><span>내 기기에만 저장</span><span>세전 단순 환산</span></footer>
      </section>

      <section className="home-guides content-width">
        <div className="section-kicker">WORK & PAY BASICS</div>
        <h2>급여를 이해하는 데 필요한<br />핵심만 정리했어요.</h2>
        <div className="guide-grid">
          <Link href="/guides/work-hours-breaks"><span>01</span><strong>근로시간과 휴게시간</strong><p>점심시간은 언제 임금에서 제외될까요?</p></Link>
          <Link href="/guides/overtime-night-holiday"><span>02</span><strong>연장·야간·휴일근로</strong><p>단순 환산과 법정수당 계산의 차이.</p></Link>
          <Link href="/guides/monthly-to-hourly"><span>03</span><strong>월급을 시급으로 환산하기</strong><p>급여명세서와 결과가 달라지는 이유.</p></Link>
          <Link href="/guides/minimum-wage-2026"><span>04</span><strong>2026년 최저임금</strong><p>시급 10,320원, 내 금액과 비교하기.</p></Link>
        </div>
        <Link className="outline-button" href="/guides">전체 가이드 보기</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
