import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";

import ContextProvider from "@/context/ContextProvider";

export const metadata = {
  title: "kchess",
  description: "Play Chess online.",
  openGraph: {
    title: "kchess",
    description: "Play Chess online.",
    url: "https://localhost:3000",
    siteName: "kchess",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: false,
    nocache: true,
    noarchive: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const { connectWallet, account, error } = useContext();
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden bg-[#141414]">
        <ContextProvider>
          <Navbar />
          <main className="mx-1 flex h-[88vh] min-h-[70vh] justify-center bg-[#141414]">
            {children}
          </main>

          <AuthModal />
        </ContextProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
