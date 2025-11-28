import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Forum | Connect with Students, Parents & Educators",
  description:
    "Join the Xogos Gaming community forum. Connect with K-12 students, homeschool parents, and educators. Discuss educational games, share learning strategies, get help, and participate in community events.",
  keywords: [
    "Xogos Gaming forum",
    "educational gaming community",
    "K-12 student forum",
    "homeschool community",
    "parent education forum",
    "teacher discussion board",
    "educational games discussion",
    "learning community",
    "student help forum",
    "homeschool resources forum",
    "educational technology community",
    "game-based learning discussion",
    "iPlay coins forum",
    "Historical Conquest community",
    "Debt-Free Millionaire discussion",
  ],
  openGraph: {
    title: "Community Forum | Xogos Gaming",
    description:
      "Join the Xogos Gaming community forum. Connect with students, parents, and educators to discuss educational games and learning strategies.",
    url: "https://xogosgaming.com/forum",
    images: [
      {
        url: "/images/fullLogo.jpeg",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Community Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Community Forum | Xogos Gaming",
    description:
      "Join the Xogos Gaming community forum. Connect with students, parents, and educators.",
    images: ["/images/fullLogo.jpeg"],
  },
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
