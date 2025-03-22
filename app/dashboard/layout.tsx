import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أوميل - لوحة التحكم",
  description:
    "لوحة التحكم الرئيسية الخاصة بتطبيق أوميل  --  لإدارة علاقات الزبائن",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>h1{children}</>;
}
