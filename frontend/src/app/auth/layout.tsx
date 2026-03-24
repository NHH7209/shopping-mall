/**
 * layout.tsx (인증)
 * 로그인·회원가입 페이지의 공통 레이아웃. Header, NavigationMenu, Footer를 포함한다.
 */
import Header from "@/components/layout/Header";
import NavigationMenu from "@/components/layout/NavigationMenu";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
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
