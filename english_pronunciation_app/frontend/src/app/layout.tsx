import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const notoSans = Noto_Sans({ 
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"], 
  variable: "--font-ipa" 
});

export const metadata: Metadata = {
  title: "PhatAmEN - Hỗ trợ phát âm tiếng Anh",
  description: "Web hỗ trợ phát âm tiếng Anh cho người Việt, sử dụng công nghệ AI và gamification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${notoSans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
