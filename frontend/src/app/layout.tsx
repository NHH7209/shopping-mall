/**
 * layout.tsx (루트)
 * 전체 앱의 최상위 레이아웃. html/body 기본 뼈대와 메타데이터를 설정하고
 * AuthInitializer로 앱 시작 시 인증 상태를 복원한다.
 */
import type { Metadata } from "next";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata: Metadata = {
  title: "Shopping Mall",
  description: "쇼핑몰 프로젝트",
};

// 루트 레이아웃 — html/body 뼈대만 담당
// Header/Nav/Footer는 (main)/layout.tsx 에서 처리
// 어드민 페이지는 admin/layout.tsx 에서 별도 처리
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
