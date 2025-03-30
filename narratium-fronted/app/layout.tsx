import type { Metadata } from "next";
import "./globals.css";
import "./styles/fonts.css";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

export const metadata: Metadata = {
  title: "Narratium - 无限文本冒险",
  description: "探索AI驱动的故事世界，每一个选择都将塑造你独特的冒险",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <SettingsProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
