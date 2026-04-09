import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoRent Albania - Platformë për Marrje Me Qira Makinash",
  description: "Platformë moderne për marrje me qira makinash me rezervim në kohë reale, vlerësime dhe autentifikim me Google OAuth",
  openGraph: {
    title: "AutoRent Albania",
    description: "Rezervo makinën tënde online - Shpejt, sigurt dhe lehtë",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
