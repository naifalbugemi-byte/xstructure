import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xstructure.ai - AI-Powered Content Creation & Marketing Platform",
  description:
    "Transform your content strategy with Xstructure.ai. Create, schedule, and publish AI-powered content across all platforms.",
  keywords:
    "AI content creation, social media automation, content marketing, AI marketing platform, content scheduling, viral content generator, marketing automation",
  authors: [{ name: "Xstructure.ai" }],
  openGraph: {
    type: "website",
    url: "https://xstructure.ai",
    title: "Xstructure.ai - AI-Powered Content Creation & Marketing Platform",
    description:
      "Transform your content strategy with AI. Create, schedule, and publish viral content across all platforms with our intelligent marketing platform.",
    siteName: "Xstructure.ai",
    images: [
      {
        url: "https://xstructure.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xstructure.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xstructure",
    title: "Xstructure.ai - AI-Powered Content Creation & Marketing Platform",
    description:
      "Transform your content strategy with AI. Create, schedule, and publish viral content across all platforms.",
    images: ["https://xstructure.ai/og-image.png"],
  },
  metadataBase: new URL("https://xstructure.ai"),
  alternates: {
    canonical: "https://xstructure.ai",
  },
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
