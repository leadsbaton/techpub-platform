import Footer from "./_components/Footer";
import Header from "./_components/Header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[color:var(--text-strong)]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
