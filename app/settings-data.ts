export type PayType = "annual" | "monthly" | "weekly" | "daily" | "hourly";

export type Settings = {
  payType: PayType;
  amount: number;
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  lunchPaid: boolean;
  workDays: number[];
  excludePublicHolidays: boolean;
};

export const DEFAULTS: Settings = {
  payType: "monthly",
  amount: 3200000,
  workStart: "09:00",
  workEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  lunchPaid: false,
  workDays: [1, 2, 3, 4, 5],
  excludePublicHolidays: true,
};

export const STORAGE_KEY = "work-ticker-settings-v2";
export const LEGACY_STORAGE_KEY = "how-much-earned-settings-v1";

export const PAY_TYPES: { value: PayType; label: string; unit: string }[] = [
  { value: "annual", label: "연봉", unit: "원/년" },
  { value: "monthly", label: "월급", unit: "원/월" },
  { value: "weekly", label: "주급", unit: "원/주" },
  { value: "daily", label: "일급", unit: "원/일" },
  { value: "hourly", label: "시급", unit: "원/시간" },
];

export const DAYS = [
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
  { value: 6, label: "토" },
  { value: 0, label: "일" },
];

// 우주항공청 2026년 월력요항과 이후 지정된 공휴일을 기준으로 한 보조 데이터입니다.
// 회사별 유급휴일은 근로계약·취업규칙에 따라 다를 수 있으므로 법정 임금 판단에는 사용하지 않습니다.
export const PUBLIC_HOLIDAYS_2026 = new Set([
  "2026-01-01",
  "2026-02-16", "2026-02-17", "2026-02-18",
  "2026-03-01", "2026-03-02",
  "2026-05-01", "2026-05-05", "2026-05-24", "2026-05-25",
  "2026-06-03", "2026-06-06",
  "2026-08-15", "2026-08-17",
  "2026-09-24", "2026-09-25", "2026-09-26",
  "2026-10-03", "2026-10-05", "2026-10-09",
  "2026-12-25",
]);

export function normalizeSettings(raw: unknown): Settings {
  const value = (raw && typeof raw === "object" ? raw : {}) as Partial<Settings> & { salary?: number };
  const payType = PAY_TYPES.some((item) => item.value === value.payType) ? value.payType! : "monthly";
  const amount = Number(value.amount ?? value.salary ?? DEFAULTS.amount);
  return {
    ...DEFAULTS,
    ...value,
    payType,
    amount: Number.isFinite(amount) && amount > 0 ? amount : DEFAULTS.amount,
    workDays: Array.isArray(value.workDays) && value.workDays.length > 0 ? value.workDays : DEFAULTS.workDays,
    lunchPaid: Boolean(value.lunchPaid),
    excludePublicHolidays: value.excludePublicHolidays !== false,
  };
}

export function timeToSeconds(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isPublicHoliday(date: Date) {
  return PUBLIC_HOLIDAYS_2026.has(dateKey(date));
}

export function workdaysInMonth(date: Date, settings: Settings) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const last = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= last; day += 1) {
    const candidate = new Date(year, month, day);
    if (!settings.workDays.includes(candidate.getDay())) continue;
    if (settings.excludePublicHolidays && isPublicHoliday(candidate)) continue;
    count += 1;
  }
  return Math.max(1, count);
}

export function getSchedule(settings: Settings) {
  const start = timeToSeconds(settings.workStart);
  let end = timeToSeconds(settings.workEnd);
  if (end <= start) end += 86400;

  let lunchStart = timeToSeconds(settings.lunchStart);
  let lunchEnd = timeToSeconds(settings.lunchEnd);
  if (lunchStart < start) lunchStart += 86400;
  if (lunchEnd <= lunchStart) lunchEnd += 86400;

  const breakSeconds = settings.lunchPaid
    ? 0
    : Math.max(0, Math.min(end, lunchEnd) - Math.max(start, lunchStart));
  const dailySeconds = Math.max(1, end - start - breakSeconds);
  return { start, end, lunchStart, lunchEnd, breakSeconds, dailySeconds, overnight: end > 86400 };
}

export function getRates(date: Date, settings: Settings) {
  const schedule = getSchedule(settings);
  const monthlyWorkdays = workdaysInMonth(date, settings);
  const weeklyDays = Math.max(1, settings.workDays.length);
  let perSecond = 0;

  if (settings.payType === "hourly") perSecond = settings.amount / 3600;
  if (settings.payType === "daily") perSecond = settings.amount / schedule.dailySeconds;
  if (settings.payType === "weekly") perSecond = settings.amount / weeklyDays / schedule.dailySeconds;
  if (settings.payType === "monthly") perSecond = settings.amount / monthlyWorkdays / schedule.dailySeconds;
  if (settings.payType === "annual") perSecond = settings.amount / 12 / monthlyWorkdays / schedule.dailySeconds;

  const dailyPay = perSecond * schedule.dailySeconds;
  return {
    ...schedule,
    perSecond,
    perMinute: perSecond * 60,
    perHour: perSecond * 3600,
    dailyPay,
    monthlyEquivalent: dailyPay * monthlyWorkdays,
    annualEquivalent: dailyPay * monthlyWorkdays * 12,
    monthlyWorkdays,
  };
}

export function getMetrics(now: Date, settings: Settings) {
  const rates = getRates(now, settings);
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  const shiftDate = new Date(now);
  let current = nowSeconds;

  if (rates.overnight && nowSeconds < rates.end - 86400) {
    current += 86400;
    shiftDate.setDate(shiftDate.getDate() - 1);
  }

  const isScheduledDay = settings.workDays.includes(shiftDate.getDay());
  const excludedHoliday = settings.excludePublicHolidays && isPublicHoliday(shiftDate);
  const isWorkday = isScheduledDay && !excludedHoliday;
  let elapsed = isWorkday ? Math.max(0, Math.min(current, rates.end) - rates.start) : 0;
  if (!settings.lunchPaid && elapsed > 0) {
    elapsed -= Math.max(0, Math.min(current, rates.lunchEnd, rates.end) - Math.max(rates.start, rates.lunchStart));
  }
  elapsed = Math.max(0, Math.min(elapsed, rates.dailySeconds));
  const isLunch = isWorkday && !settings.lunchPaid && current >= rates.lunchStart && current < rates.lunchEnd;
  const isWorking = isWorkday && current >= rates.start && current < rates.end && !isLunch;

  return {
    ...rates,
    earned: elapsed * rates.perSecond,
    remaining: Math.max(0, rates.dailyPay - elapsed * rates.perSecond),
    progress: elapsed / rates.dailySeconds,
    isWorking,
    isLunch,
    isDone: elapsed >= rates.dailySeconds,
    isWorkday,
    excludedHoliday,
  };
}
