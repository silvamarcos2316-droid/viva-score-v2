import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConsentBanner } from "@/components/ConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRISMA - Diagnóstico Estratégico para Negócios AI-First",
  description: "Plataforma de diagnóstico empresarial estruturado em 4 dimensões: Posicionamento, Recursos, Implementação, Sustentação, Maturidade e Adaptação. Voltada para executivos e tomadores de decisão.",
  keywords: ["diagnóstico empresarial", "AI-First", "estratégia", "business intelligence", "transformação digital", "PRISMA", "gestão estratégica"],
  authors: [{ name: "AIOS" }],
  creator: "AIOS",
  openGraph: {
    title: "PRISMA - Diagnóstico Estratégico para Negócios AI-First",
    description: "Plataforma de diagnóstico empresarial estruturado para tomadores de decisão",
    url: "https://viva-score-v2.vercel.app",
    siteName: "PRISMA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
