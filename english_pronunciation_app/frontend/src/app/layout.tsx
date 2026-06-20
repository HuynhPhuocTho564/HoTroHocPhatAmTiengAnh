import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import RewardEffectsLayer from "@/components/gamification/RewardEffectsLayer";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const notoSans = Noto_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-ipa",
});

export const metadata: Metadata = {
  title: "PhatAmEN - Hỗ trợ phát âm tiếng Anh",
  description: "Web hỗ trợ phát âm tiếng Anh cho người Việt, sử dụng AI và gamification",
};

const themeInitScript = `
  (function () {
    // Force light mode only
    document.documentElement.dataset.theme = "light";
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${notoSans.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <ThemeProvider>
          <RewardEffectsLayer>
            <Navbar />
            <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </div>
            <Footer />
          </RewardEffectsLayer>
        </ThemeProvider>
      </body>
    </html>
  );
}
