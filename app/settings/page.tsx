"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { DAYS, DEFAULTS, LEGACY_STORAGE_KEY, PAY_TYPES, STORAGE_KEY, Settings, normalizeSettings, timeToSeconds } from "../settings-data";

export default function SettingsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next = DEFAULTS;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) next = normalizeSettings(JSON.parse(saved));
    } catch {
      // 브라우저 저장소가 막혀 있으면 안전한 기본값을 사용합니다.
    }
    const frame = window.requestAnimationFrame(() => {
      setDraft(next);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (timeToSeconds(draft.workEnd) === timeToSeconds(draft.workStart) || draft.amount <= 0 || draft.workDays.length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    router.push("/");
  }

  return (
    <main className="app-shell settings-shell">
      <section className="settings-page">
        <header className="topbar">
          <Link className="brand-lockup brand-link" href="/settings" aria-label="급여 정보 입력 페이지">
            <span className="brand-mark" aria-hidden="true">₩</span><span>WORK TICKER</span>
          </Link>
          <Link className="close-settings" href="/">카운터로 ↗</Link>
        </header>

        <div className="settings-hero">
          <p className="eyebrow">MY WORK RULE</p>
          <h1>내 급여<br />기준 입력</h1>
          <p>입력한 정보는 로그인 없이 이 기기에만 저장됩니다. 세전 단순 환산이며 실제 급여명세서를 대체하지 않습니다.</p>
        </div>

        <form className="settings-form" onSubmit={saveSettings} aria-busy={!ready}>
          <section className="form-section">
            <div className="form-index">01</div>
            <div className="form-body">
              <fieldset className="pay-type-field">
                <legend>급여 종류</legend>
                <div className="segmented-picker">
                  {PAY_TYPES.map((item) => (
                    <button key={item.value} type="button" className={draft.payType === item.value ? "selected" : ""} aria-pressed={draft.payType === item.value} onClick={() => setDraft({ ...draft, payType: item.value })}>{item.label}</button>
                  ))}
                </div>
              </fieldset>
              <label className="salary-field">
                <span>{PAY_TYPES.find((item) => item.value === draft.payType)?.label} (세전)</span>
                <div><input inputMode="numeric" pattern="[0-9]*" value={draft.amount || ""} onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value.replace(/\D/g, "")) })} required /><span>원</span></div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-index">02</div>
            <div className="form-body">
              <div className="time-group first-group"><p>근무 요일</p>
                <div className="weekday-picker" aria-label="근무 요일 선택">
                  {DAYS.map((day) => {
                    const selected = draft.workDays.includes(day.value);
                    return <button key={day.value} type="button" className={selected ? "selected" : ""} aria-pressed={selected} onClick={() => setDraft({ ...draft, workDays: selected ? draft.workDays.filter((value) => value !== day.value) : [...draft.workDays, day.value] })}>{day.label}</button>;
                  })}
                </div>
                {draft.workDays.length === 0 && <p className="field-error">하루 이상 선택해주세요.</p>}
              </div>
              <label className="toggle-row"><span><strong>2026년 대한민국 공휴일 제외</strong><small>회사 규정과 다를 수 있으며 계산 편의를 위한 설정입니다.</small></span><input type="checkbox" checked={draft.excludePublicHolidays} onChange={(event) => setDraft({ ...draft, excludePublicHolidays: event.target.checked })} /></label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-index">03</div>
            <div className="form-body">
              <div className="time-group first-group"><p>근무시간</p><div className="time-pair">
                <label><span>출근</span><input type="time" value={draft.workStart} onChange={(event) => setDraft({ ...draft, workStart: event.target.value })} required /></label><i>—</i>
                <label><span>퇴근</span><input type="time" value={draft.workEnd} onChange={(event) => setDraft({ ...draft, workEnd: event.target.value })} required /></label>
              </div><small className="field-help">퇴근이 출근보다 이르면 다음 날 퇴근하는 야간근무로 계산합니다.</small></div>
              <div className="time-group"><p>휴게·점심시간</p><div className="time-pair">
                <label><span>시작</span><input type="time" value={draft.lunchStart} onChange={(event) => setDraft({ ...draft, lunchStart: event.target.value })} required /></label><i>—</i>
                <label><span>종료</span><input type="time" value={draft.lunchEnd} onChange={(event) => setDraft({ ...draft, lunchEnd: event.target.value })} required /></label>
              </div></div>
              <label className="toggle-row"><span><strong>휴게시간도 유급이에요</strong><small>켜면 휴게시간에도 카운터가 계속 올라갑니다.</small></span><input type="checkbox" checked={draft.lunchPaid} onChange={(event) => setDraft({ ...draft, lunchPaid: event.target.checked })} /></label>
            </div>
          </section>

          <div className="settings-actions">
            <p className="formula-note">급여 종류를 실제 근무시간으로 바꿔 초당 금액을 계산합니다. 세금·4대 보험·연장·야간·휴일근로 가산수당은 포함하지 않습니다.</p>
            <button className="save-button" type="submit" disabled={!ready || draft.workDays.length === 0 || draft.amount <= 0}>저장하고 카운터 보기 <span>↗</span></button>
            <Link className="text-link" href="/calculation">계산 기준 자세히 보기</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
