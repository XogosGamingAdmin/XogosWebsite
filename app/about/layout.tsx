import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Xogos Gaming | Educational Gaming for K-12 Students & Teachers",
  description:
    "Learn about Xogos Gaming, an educational gaming platform for K-12 students, homeschoolers, parents, and teachers. Discover our mission to transform education through engaging gameplay, earn rewards, and scholarship opportunities.",
  keywords: [
    "about Xogos Gaming",
    "educational gaming company",
    "K-12 education technology",
    "homeschool education platform",
    "educational game developer",
    "learning through games",
    "iPlay coins",
    "student rewards program",
    "education scholarship gaming",
    "safe gaming for kids",
    "teacher resources",
    "parent education tools",
    "edtech company",
    "gamified education platform",
    "education rewards",
  ],
  openGraph: {
    title: "About Xogos Gaming | Educational Gaming for K-12 Students",
    description:
      "Xogos Gaming transforms education through engaging gameplay. Learn about our mission, team, and how students can earn real rewards and scholarship opportunities.",
    url: "https://xogosgaming.com/about",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "About Xogos Gaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "About Xogos Gaming | Educational Gaming for K-12 Students",
    description:
      "Xogos Gaming transforms education through engaging gameplay. Learn about our mission and team.",
    images: ["/images/XogosLogo.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
