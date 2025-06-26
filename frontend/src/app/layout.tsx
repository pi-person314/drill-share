import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "../styles/globals.css";

const exo = Exo({
  variable: "--exo",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Drill Share",
  description: "A platform for discovering and sharing new ways to practice sports!",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${exo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
