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
