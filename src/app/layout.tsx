import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, DM_Sans, Pinyon_Script } from "next/font/google";
import { wedding } from "@/config/wedding";
import { getSiteUrl } from "@/lib/site";
import { DecorDefs } from "@/components/decor/DecorDefs";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const title = `The Wedding of ${wedding.groom.nickname} & ${wedding.bride.nickname}`;
const description = `Dengan penuh sukacita kami mengundang Anda di hari pernikahan ${wedding.groom.nickname} & ${wedding.bride.nickname} — ${wedding.dateLabel}.`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  applicationName: title,
  openGraph: {
    type: "website",
    locale: "id_ID",
    title,
    description,
    siteName: title,
    images: [{ url: "/images/couple/og.jpg", width: 1200, height: 630, alt: `${wedding.groom.nickname} & ${wedding.bride.nickname}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/couple/og.jpg"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#4A0E1C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable} ${pinyon.variable} ${bodoni.variable}`}>
      {/* suppressHydrationWarning: extension browser sering menambah atribut ke <body> */}
      <body suppressHydrationWarning>
        <DecorDefs />
        {children}
      </body>
    </html>
  );
}
