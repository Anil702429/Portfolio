import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/env";
import { getSettings } from "@/lib/queries";
import "./globals.css";

const heading = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.name} | ${settings.professionalTitle}`;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: title, template: `%s | ${settings.name}` },
    description: settings.introduction,
    authors: [{ name: settings.name }],
    openGraph: { type: "website", siteName: settings.name },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#111214" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
