import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "휴식 시간 알림",
  description: "수업 휴식 시간 알림 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
