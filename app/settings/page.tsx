"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { DAYS, DEFAULTS, STORAGE_KEY, Settings, timeToSeconds } from "../settings-data";

export default function SettingsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = { ...DEFAULTS, ...JSON.parse(saved) } as Settings;
        if (!Array.isArray(parsed.workDays) || parsed.workDays.length === 0) parsed.workDays = DEFAULTS.workDays;
        setDraft(parsed);
      }
    } catch {
      // Keep the safe defaults if browser storage is unavailable.
    }
    setReady(true);
  }, []);

  function saveSettings(event: FormEvent) {
    event.preventDefault();
    const start = timeToSeconds(draft.workStart);
    const end = timeToSeconds(draft.workEnd);
    if (end <= start || draft.salary <= 0 || draft.workDays.length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    router.push("/");
  }

  return (
    <main className="app-shell settings-shell">
      <section className="settings-page">
        <header className="topbar">
          <Link className="brand-lockup brand-link" href="/" aria-label="실시간 급여 화면으로 이동">
            <span className="brand-mark" aria-hidden="true">₩</span>
            <span>WORK TICKER</span>
          </Link>
          <span className="page-number">SETTINGS / 01</span>
        </header>

        <div className="settings-hero">
          <p className="eyebrow">MY WORK RULE</p>
          <h1>내 급여<br />기준 입력</h1>
          <p>입력한 정보는 로그인 없이 이 기기에만 저장됩니다.</p>
        </div>

        <form className="settings-form" onSubmit={saveSettings} aria-busy={!ready}>
          <section className="form-section">
            <div className="form-index">01</div>
            <div className="form-body">
              <label className="salary-field">
                <span>월급 (세전)</span>
                <div>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={draft.salary}
                    onChange={(event) => setDraft({ ...draft, salary: Number(event.target.value.replace(/\D/g, "")) })}
                    required
                  />
                  <span>원</span>
                </div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-index">02</div>
            <div className="form-body">
              <div className="time-group first-group">
                <p>근무 요일</p>
                <div className="weekday-picker" aria-label="근무 요일 선택">
                  {DAYS.map((day) => {
                    const selected = draft.workDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        className={selected ? "selected" : ""}
                        aria-pressed={selected}
                        onClick={() => setDraft({
                          ...draft,
                          workDays: selected
                            ? draft.workDays.filter((value) => value !== day.value)
                            : [...draft.workDays, day.value],
                        })}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                {draft.workDays.length === 0 && <p className="field-error">하루 이상 선택해주세요.</p>}
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-index">03</div>
            <div className="form-body">
              <div className="time-group first-group">
                <p>근무시간</p>
                <div className="time-pair">
                  <label><span>출근</span><input type="time" value={draft.workStart} onChange={(event) => setDraft({ ...draft, workStart: event.target.value })} required /></label>
                  <i>—</i>
                  <label><span>퇴근</span><input type="time" value={draft.workEnd} onChange={(event) => setDraft({ ...draft, workEnd: event.target.value })} required /></label>
                </div>
              </div>
              <div className="time-group">
                <p>점심시간</p>
                <div className="time-pair">
                  <label><span>시작</span><input type="time" value={draft.lunchStart} onChange={(event) => setDraft({ ...draft, lunchStart: event.target.value })} required /></label>
                  <i>—</i>
                  <label><span>종료</span><input type="time" value={draft.lunchEnd} onChange={(event) => setDraft({ ...draft, lunchEnd: event.target.value })} required /></label>
                </div>
              </div>
            </div>
          </section>

          <div className="settings-actions">
            <p className="formula-note">월급을 이번 달 선택한 근무일 수와 실제 근무시간(점심 제외)으로 나눠 계산해요.</p>
            <button className="save-button" type="submit" disabled={!ready || draft.workDays.length === 0}>
              저장하고 카운터 보기 <span>↗</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
