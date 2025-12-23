import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INEA.mx - Educación para Adultos",
  description: "Plataforma educativa para adultos en México.",
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
      <body className={`${inter.className} antialiased bg-slate-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
