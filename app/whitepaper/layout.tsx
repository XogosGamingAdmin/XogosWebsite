import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper | Educational Gaming Platform for K-12 Students & Schools",
  description:
    "Read the Xogos Gaming Whitepaper detailing our educational gaming platform for K-12 students, homeschoolers, and schools. Learn about our dual-token system, scholarship opportunities, curriculum-aligned games, and how students can earn rewards through learning.",
  keywords: [
    "Xogos whitepaper",
    "educational gaming platform",
    "K-12 education technology",
    "student scholarship gaming",
    "iPlay token",
    "educational rewards system",
    "gamified learning platform",
    "homeschool curriculum",
    "school gaming integration",
    "educational game platform",
    "learn and earn platform",
    "student achievement rewards",
    "educational technology whitepaper",
    "blockchain education platform",
    "history education games",
    "personal finance games for students",
  ],
  openGraph: {
    title: "Whitepaper | Xogos Gaming Educational Platform",
    description:
      "Read the Xogos Gaming Whitepaper detailing our educational gaming platform for K-12 students and schools. Learn about scholarship opportunities and curriculum-aligned games.",
    url: "https://xogosgaming.com/whitepaper",
    images: [
      {
        url: "/images/fullLogo.jpeg",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Whitepaper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Whitepaper | Xogos Gaming Educational Platform",
    description:
      "Read the Xogos Gaming Whitepaper about our educational gaming platform for K-12 students.",
    images: ["/images/fullLogo.jpeg"],
  },
};

export default function WhitepaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
