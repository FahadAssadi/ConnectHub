import { Header } from "@/app/home/(components)/header"
import { Footer } from "@/app/home/(components)/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
        <Header />
            {children}
        <Footer />
    </div>
  );
}