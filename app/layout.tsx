import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://seifelden.dev"),
  title: {
    default: "Seif Elden Hesham | Frontend Developer",
    template: "%s | Seif Elden Hesham",
  },
  description:
    "Passionate frontend developer specializing in React, Next.js, and modern web technologies. Creating exceptional digital experiences with clean code and modern design.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Web Developer",
    "Seif Elden Hesham",
    "Portfolio",
    "Egypt",
    "UI/UX",
    "JavaScript",
  ],
  authors: [{ name: "Seif Elden Hesham", url: "https://seifelden.dev" }],
  creator: "Seif Elden Hesham",
  publisher: "Seif Elden Hesham",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seifelden.dev",
    title: "Seif Elden Hesham | Frontend Developer",
    description:
      "Passionate frontend developer specializing in React, Next.js, and modern web technologies. Creating exceptional digital experiences.",
    siteName: "Seif Elden Hesham Portfolio",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Seif Elden Hesham - Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seif Elden Hesham | Frontend Developer",
    description:
      "Passionate frontend developer specializing in React, Next.js, and modern web technologies.",
    images: ["/images/og-image.png"],
    creator: "@seifelden",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
