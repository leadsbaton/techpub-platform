import Footer from "./_components/Footer";
import Header from "./_components/Header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[color:var(--text-strong)]">
      <Header />
      <main className="flex flex-1 flex-col [&>*]:grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
