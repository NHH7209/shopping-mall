import Header from "@/components/layout/Header";
import NavigationMenu from "@/components/layout/NavigationMenu";
import Footer from "@/components/layout/Footer";

// (main) 그룹 레이아웃 — 쇼핑몰 고객 페이지에만 적용
// 괄호로 감싼 폴더명 (main)은 URL에 영향을 주지 않음
// 예: (main)/products/page.tsx → /products 로 접근
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <NavigationMenu />
      <main className="mt-[140px]">{children}</main>
      <Footer />
    </>
  );
}
