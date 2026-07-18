"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Settings = {
  salary: number;
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  workDays: number[];
};

const DEFAULTS: Settings = {
  salary: 3200000,
  workStart: "09:00",
  workEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  workDays: [1, 2, 3, 4, 5],
};

const STORAGE_KEY = "how-much-earned-settings-v1";
const DAYS = [
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
  { value: 6, label: "토" },
  { value: 0, label: "일" },
];

function timeToSeconds(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

function workdaysInMonth(date: Date, selectedDays: number[]) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const last = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= last; day += 1) {
    const weekday = new Date(year, month, day).getDay();
    if (selectedDays.includes(weekday)) count += 1;
  }
  return count;
}

function formatWon(value: number, decimals = 0) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.max(0, value));
}

function getMetrics(now: Date, settings: Settings) {
  const start = timeToSeconds(settings.workStart);
  const end = timeToSeconds(settings.workEnd);
  const lunchStart = timeToSeconds(settings.lunchStart);
  const lunchEnd = timeToSeconds(settings.lunchEnd);
  const lunchSeconds = Math.max(0, Math.min(end, lunchEnd) - Math.max(start, lunchStart));
  const dailySeconds = Math.max(1, end - start - lunchSeconds);
  const workdays = Math.max(1, workdaysInMonth(now, settings.workDays));
  const perSecond = settings.salary / workdays / dailySeconds;
  const current = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  const isWorkday = settings.workDays.includes(now.getDay());
  let elapsed = isWorkday ? Math.max(0, Math.min(current, end) - start) : 0;
  if (elapsed > 0) {
    elapsed -= Math.max(0, Math.min(current, lunchEnd, end) - Math.max(start, lunchStart));
  }
  elapsed = Math.max(0, Math.min(elapsed, dailySeconds));
  return {
    earned: elapsed * perSecond,
    perSecond,
    progress: elapsed / dailySeconds,
    workdays,
    isWorking: elapsed > 0 && elapsed < dailySeconds && !(current >= lunchStart && current < lunchEnd),
    isLunch: isWorkday && current >= lunchStart && current < lunchEnd,
    isDone: elapsed >= dailySeconds,
    isWorkday,
    dailyPay: settings.salary / workdays,
  };
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [draft, setDraft] = useState<Settings>(DEFAULTS);
  const [now, setNow] = useState(() => new Date());
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = { ...DEFAULTS, ...JSON.parse(saved) } as Settings;
        if (!Array.isArray(parsed.workDays) || parsed.workDays.length === 0) parsed.workDays = DEFAULTS.workDays;
        setSettings(parsed);
        setDraft(parsed);
      } else {
        setEditing(true);
      }
    } catch {
      // Corrupt or unavailable local storage should never block the counter.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 100);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => getMetrics(now, settings), [now, settings]);
  const monthLabel = `${now.getMonth() + 1}월`;
  const dateLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);
  const timeLabel = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const status = metrics.isLunch
    ? "점심시간 · 잠시 멈춤"
    : metrics.isDone
      ? "오늘 근무 완료"
      : !metrics.isWorkday
        ? "오늘은 선택한 근무 요일이 아니에요"
        : metrics.isWorking
        ? "지금도 쌓이는 중"
        : "아직 근무시간 전이에요";

  function openEditor() {
    setDraft(settings);
    setEditing(true);
  }

  function saveSettings(event: FormEvent) {
    event.preventDefault();
    const start = timeToSeconds(draft.workStart);
    const end = timeToSeconds(draft.workEnd);
    if (end <= start || draft.salary <= 0 || draft.workDays.length === 0) return;
    setSettings(draft);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setEditing(false);
  }

  return (
    <main className="app-shell">
      <section className="payslip" aria-live="polite">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">₩</span>
            <span>WORK TICKER</span>
          </div>
          <time dateTime={now.toISOString()}>{timeLabel}</time>
        </header>

        <div className="intro">
          <p className="eyebrow">오늘의 실시간 급여</p>
          <h1>지금, 얼마<br />벌었지?</h1>
          <p className="today">{dateLabel}</p>
        </div>

        <section className="earnings-block" aria-label="오늘 번 금액">
          <div className="status-line">
            <span className={`live-dot ${metrics.isWorking ? "is-live" : ""}`} />
            <span>{status}</span>
          </div>
          <p className="earnings" data-testid="earned-amount">
            {ready ? formatWon(metrics.earned, 2) : "₩0.00"}
          </p>
          <div className="rate-row">
            <span>1초마다</span>
            <strong>{formatWon(metrics.perSecond, 2)}</strong>
          </div>
        </section>

        <section className="progress-section" aria-label="오늘 근무 진행률">
          <div className="progress-heading">
            <span>WORKDAY PROGRESS</span>
            <strong>{Math.round(metrics.progress * 100)}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${metrics.progress * 100}%` }} />
          </div>
          <div className="progress-times">
            <span>{settings.workStart}</span>
            <span>점심 {settings.lunchStart}—{settings.lunchEnd}</span>
            <span>{settings.workEnd}</span>
          </div>
        </section>

        <section className="details" aria-label="급여 계산 설정">
          <div className="detail-title">
            <span>PAY SLIP / {monthLabel}</span>
            <button type="button" onClick={openEditor}>수정하기</button>
          </div>
          <dl>
            <div><dt>월급</dt><dd>{formatWon(settings.salary)}</dd></div>
            <div><dt>근무시간</dt><dd>{settings.workStart} — {settings.workEnd}</dd></div>
            <div><dt>점심시간</dt><dd>{settings.lunchStart} — {settings.lunchEnd}</dd></div>
            <div><dt>근무 요일</dt><dd>{DAYS.filter((day) => settings.workDays.includes(day.value)).map((day) => day.label).join("·")}</dd></div>
            <div><dt>이번 달 근무일</dt><dd>{metrics.workdays}일</dd></div>
            <div className="total"><dt>하루 급여</dt><dd>{formatWon(metrics.dailyPay)}</dd></div>
          </dl>
        </section>

        <footer>
          <span>로그인 없이</span>
          <span>내 기기에만 저장</span>
          <span>선택한 근무 요일 기준</span>
        </footer>
      </section>

      {editing && ready && (
        <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target && window.localStorage.getItem(STORAGE_KEY)) setEditing(false);
        }}>
          <section className="edit-sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="sheet-handle" />
            <div className="sheet-heading">
              <div>
                <p>MY WORK RULE</p>
                <h2 id="settings-title">내 급여 기준</h2>
              </div>
              {window.localStorage.getItem(STORAGE_KEY) && (
                <button className="close-button" type="button" onClick={() => setEditing(false)} aria-label="닫기">×</button>
              )}
            </div>
            <form onSubmit={saveSettings}>
              <label className="salary-field">
                <span>월급 (세전)</span>
                <div><input inputMode="numeric" pattern="[0-9]*" value={draft.salary} onChange={(e) => setDraft({ ...draft, salary: Number(e.target.value.replace(/\D/g, "")) })} required /><span>원</span></div>
              </label>
              <div className="time-group">
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
              <div className="time-group">
                <p>근무시간</p>
                <div className="time-pair">
                  <label><span>출근</span><input type="time" value={draft.workStart} onChange={(e) => setDraft({ ...draft, workStart: e.target.value })} required /></label>
                  <i>—</i>
                  <label><span>퇴근</span><input type="time" value={draft.workEnd} onChange={(e) => setDraft({ ...draft, workEnd: e.target.value })} required /></label>
                </div>
              </div>
              <div className="time-group">
                <p>점심시간</p>
                <div className="time-pair">
                  <label><span>시작</span><input type="time" value={draft.lunchStart} onChange={(e) => setDraft({ ...draft, lunchStart: e.target.value })} required /></label>
                  <i>—</i>
                  <label><span>종료</span><input type="time" value={draft.lunchEnd} onChange={(e) => setDraft({ ...draft, lunchEnd: e.target.value })} required /></label>
                </div>
              </div>
              <p className="formula-note">월급을 이번 달 선택한 근무일 수와 실제 근무시간(점심 제외)으로 나눠 계산해요.</p>
              <button className="save-button" type="submit">이 기준으로 시작하기 <span>↗</span></button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
