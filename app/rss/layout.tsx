import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media & RSS Feeds | Follow Xogos Gaming",
  description:
    "Follow Xogos Gaming on social media and subscribe to our RSS feeds. Connect with us on Twitter/X, Facebook, Instagram, Pinterest, and YouTube for educational gaming updates, homeschool resources, and K-12 learning content.",
  keywords: [
    "Xogos Gaming social media",
    "educational gaming RSS feeds",
    "follow Xogos Gaming",
    "Xogos Twitter",
    "Xogos Facebook",
    "Xogos Instagram",
    "Xogos Pinterest",
    "Xogos YouTube",
    "educational gaming updates",
    "homeschool resources social media",
    "K-12 education social media",
    "Historical Conquest social",
    "educational games news",
  ],
  openGraph: {
    title: "Social Media & RSS Feeds | Xogos Gaming",
    description:
      "Follow Xogos Gaming on social media. Connect with us on Twitter/X, Facebook, Instagram, Pinterest, and YouTube for educational gaming updates.",
    url: "https://xogosgaming.com/rss",
    images: [
      {
        url: "/images/fullLogo.jpeg",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Social Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Social Media & RSS Feeds | Xogos Gaming",
    description:
      "Follow Xogos Gaming on social media for educational gaming updates and resources.",
    images: ["/images/fullLogo.jpeg"],
  },
};

export default function RSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
