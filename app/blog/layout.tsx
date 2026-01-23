import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Educational Gaming News, Tips & Resources for K-12 Education",
  description:
    "Read the latest from Xogos Gaming about educational games, homeschool resources, K-12 learning strategies, and tips for parents and teachers. Stay updated on new game releases and educational content.",
  keywords: [
    "educational gaming blog",
    "homeschool resources blog",
    "K-12 education articles",
    "educational games news",
    "learning games tips",
    "parent education resources",
    "teacher gaming resources",
    "homeschool curriculum ideas",
    "educational technology news",
    "student learning strategies",
    "game-based learning articles",
    "edtech blog",
    "classroom gaming tips",
    "financial literacy education",
    "history education resources",
  ],
  openGraph: {
    title: "Blog | Xogos Gaming Educational Resources",
    description:
      "Read the latest about educational games, homeschool resources, K-12 learning strategies, and tips for parents and teachers.",
    url: "https://xogosgaming.com/blog",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Blog | Xogos Gaming Educational Resources",
    description:
      "Read the latest about educational games, homeschool resources, and K-12 learning strategies.",
    images: ["/images/XogosLogo.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
