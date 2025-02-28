import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectionProvider } from "@/context/ProjectionContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Growth Projection & Revenue Modeling App",
  description: "A powerful tool for modeling subscriber growth and revenue projections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <ProjectionProvider>
            {children}
          </ProjectionProvider>
        </div>
      </body>
    </html>
  );
}
