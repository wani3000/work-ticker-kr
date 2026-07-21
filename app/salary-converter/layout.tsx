import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연봉·월급·일급 계산기",
  description: "연봉, 월급 또는 일급 하나를 입력하면 월 근무일과 실근무시간 기준으로 서로 환산하고 시급과 초당 금액까지 보여줍니다.",
};

export default function SalaryConverterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
