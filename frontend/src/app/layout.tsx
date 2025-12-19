import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INEA.mx - Educación para Adultos",
  description: "Plataforma de educación básica para adultos del Instituto Nacional para la Educación de los Adultos. Cursos gratuitos de primaria y secundaria con apoyo de inteligencia artificial.",
  keywords: ["INEA", "educación", "adultos", "primaria", "secundaria", "México", "gratuito"],
  authors: [{ name: "INEA México" }],
  openGraph: {
    title: "INEA.mx - Educación para Adultos",
    description: "Aprende primaria y secundaria gratis con tutor de IA",
    type: "website",
    locale: "es_MX",
  },
  manifest: "/manifest.json",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} antialiased bg-slate-900`}>
        {children}
      </body>
    </html>
  );
}
