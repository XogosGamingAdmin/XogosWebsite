import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Xogos Gaming",
  description:
    "Answers about Xogos Gaming: educational games and academies for ages 6-19, iPlay coins and scholarships, student safety, parent controls, and membership pricing.",
  openGraph: {
    title: "Xogos Gaming FAQ",
    description:
      "Games, academies, iPlay coins, scholarships, safety and membership: the questions families ask most.",
    url: "https://xogosgaming.com/faq",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming FAQ",
      },
    ],
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
