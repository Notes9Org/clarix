import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clarix — 503B Digital Batch Records",
  description:
    "Digital batch record and facility management platform for FDA-registered 503B outsourcing compounding facilities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
