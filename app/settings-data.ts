export type Settings = {
  salary: number;
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  workDays: number[];
};

export const DEFAULTS: Settings = {
  salary: 3200000,
  workStart: "09:00",
  workEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  workDays: [1, 2, 3, 4, 5],
};

export const STORAGE_KEY = "how-much-earned-settings-v1";

export const DAYS = [
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
  { value: 6, label: "토" },
  { value: 0, label: "일" },
];

export function timeToSeconds(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}
