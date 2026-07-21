"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { LEGACY_STORAGE_KEY, STORAGE_KEY, getRates, normalizeSettings } from "../settings-data";

type Basis = "annual" | "monthly" | "daily";

const basisOptions: { value: Basis; label: string }[] = [
  { value: "annual", label: "연봉" },
  { value: "monthly", label: "월급" },
  { value: "daily", label: "일급" },
];

function formatWon(value: number, decimals = 0) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? Math.max(0, value) : 0);
}

export default function SalaryConverterPage() {
  const [basis, setBasis] = useState<Basis>("annual");
  const [amount, setAmount] = useState(40000000);
  const [workdays, setWorkdays] = useState(22);
  const [dailyHours, setDailyHours] = useState(8);
  const [loadedFromTicker, setLoadedFromTicker] = useState(false);

  useEffect(() => {
    let nextBasis: Basis = "annual";
    let nextAmount = 40000000;
    let nextWorkdays = 22;
    let nextHours = 8;
    let hasSaved = false;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const settings = normalizeSettings(JSON.parse(saved));
        const rates = getRates(new Date(), settings);
        nextWorkdays = rates.monthlyWorkdays;
        nextHours = Math.max(0.5, rates.dailySeconds / 3600);
        if (settings.payType === "annual") {
          nextBasis = "annual";
          nextAmount = settings.amount;
        } else if (settings.payType === "monthly") {
          nextBasis = "monthly";
          nextAmount = settings.amount;
        } else if (settings.payType === "daily") {
          nextBasis = "daily";
          nextAmount = settings.amount;
        } else {
          nextBasis = "monthly";
          nextAmount = rates.monthlyEquivalent;
        }
        hasSaved = true;
      }
    } catch {
      // 저장값을 읽지 못하면 예시값으로 시작합니다.
    }

    const frame = window.requestAnimationFrame(() => {
      setBasis(nextBasis);
      setAmount(nextAmount);
      setWorkdays(nextWorkdays);
      setDailyHours(nextHours);
      setLoadedFromTicker(hasSaved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const result = useMemo(() => {
    const safeDays = Math.max(1, workdays);
    const safeHours = Math.max(0.5, dailyHours);
    const annual = basis === "annual" ? amount : basis === "monthly" ? amount * 12 : amount * safeDays * 12;
    const monthly = basis === "monthly" ? amount : basis === "annual" ? amount / 12 : amount * safeDays;
    const daily = basis === "daily" ? amount : monthly / safeDays;
    const hourly = daily / safeHours;
    return { annual, monthly, daily, hourly, perMinute: hourly / 60, perSecond: hourly / 3600 };
  }, [amount, basis, dailyHours, workdays]);

  const inputLabel = basisOptions.find((item) => item.value === basis)?.label ?? "연봉";

  return (
    <main className="content-shell converter-shell">
      <SiteHeader />
      <section className="converter-hero content-width">
        <p className="eyebrow">SALARY CONVERTER</p>
        <h1>연봉·월급·일급<br />한 번에 환산하기</h1>
        <p>한 가지 금액만 입력하면 같은 근무 기준의 연봉, 월급, 일급, 시급과 초당 금액을 바로 보여줍니다.</p>
      </section>

      <section className="converter-layout content-width">
        <form className="converter-form" onSubmit={(event) => event.preventDefault()}>
          <div className="converter-field">
            <span className="field-number">01</span>
            <fieldset>
              <legend>어떤 금액을 입력할까요?</legend>
              <div className="converter-tabs">
                {basisOptions.map((option) => (
                  <button key={option.value} type="button" className={basis === option.value ? "selected" : ""} aria-pressed={basis === option.value} onClick={() => setBasis(option.value)}>{option.label}</button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="converter-field">
            <span className="field-number">02</span>
            <label className="converter-amount"><span>{inputLabel} (세전)</span><div><input aria-label={`${inputLabel} 금액`} inputMode="numeric" pattern="[0-9]*" value={amount || ""} onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")))} /><b>원</b></div></label>
          </div>

          <div className="converter-field converter-conditions">
            <span className="field-number">03</span>
            <div><p className="condition-title">환산 근무 기준</p><div className="condition-grid">
              <label><span>월 근무일</span><div><input aria-label="월 근무일" type="number" min="1" max="31" value={workdays} onChange={(event) => setWorkdays(Number(event.target.value))} /><b>일</b></div></label>
              <label><span>하루 실근무</span><div><input aria-label="하루 실근무시간" type="number" min="0.5" max="24" step="0.5" value={dailyHours} onChange={(event) => setDailyHours(Number(event.target.value))} /><b>시간</b></div></label>
            </div>{loadedFromTicker && <small>✓ 실시간 카운터에 저장된 이번 달 근무 기준을 불러왔어요.</small>}</div>
          </div>
        </form>

        <section className="converter-result" aria-live="polite">
          <div className="result-heading"><span>CONVERSION RESULT</span><small>세전 단순 환산</small></div>
          <dl>
            <div className="primary"><dt>연봉</dt><dd>{formatWon(result.annual)}</dd></div>
            <div className="primary"><dt>월급</dt><dd>{formatWon(result.monthly)}</dd></div>
            <div className="primary"><dt>일급</dt><dd>{formatWon(result.daily)}</dd></div>
            <div><dt>시급</dt><dd>{formatWon(result.hourly)}</dd></div>
            <div><dt>분당</dt><dd>{formatWon(result.perMinute, 2)}</dd></div>
            <div><dt>초당</dt><dd>{formatWon(result.perSecond, 2)}</dd></div>
          </dl>
          <p className="result-formula">{inputLabel} {formatWon(amount)} · 월 {workdays}일 · 하루 {dailyHours}시간 기준</p>
          <Link href="/settings">실시간 카운터 설정 열기 →</Link>
        </section>
      </section>

      <section className="converter-explanation content-width">
        <div><span>01</span><h2>연봉에서 월급</h2><p>세전 연봉을 12개월로 나눕니다. 성과급·퇴직금처럼 연봉에 포함되는 항목은 회사마다 다르므로 계약서의 연봉 구성을 먼저 확인하세요.</p></div>
        <div><span>02</span><h2>월급에서 일급</h2><p>세전 월급을 입력한 월 근무일로 나눕니다. 달력상의 실제 근무일을 이용한 생활 환산이며 통상임금 계산과는 다릅니다.</p></div>
        <div><span>03</span><h2>일급에서 연봉</h2><p>일급에 월 근무일과 12개월을 곱합니다. 휴일, 무급휴가, 변동 근무가 있다면 실제 연간 지급액과 차이가 날 수 있습니다.</p></div>
      </section>

      <aside className="converter-notice content-width"><strong>계산에 포함하지 않는 것</strong><p>근로소득세, 4대 보험, 퇴직금, 성과급, 주휴수당, 연장·야간·휴일근로 가산수당은 자동 반영하지 않습니다. 실제 계약이나 임금 청구에는 급여명세서와 공식 상담을 이용하세요.</p><Link href="/calculation">전체 계산 기준 보기</Link></aside>
      <SiteFooter />
    </main>
  );
}
