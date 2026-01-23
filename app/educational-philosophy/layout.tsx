import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Educational Philosophy | Research-Based Learning Through Gaming for K-12",
  description:
    "Discover the educational philosophy behind Xogos Gaming. Learn how our research-based approach to game-based learning helps K-12 students, homeschoolers, and classroom educators achieve better learning outcomes through intrinsic motivation and competency-based progression.",
  keywords: [
    "educational philosophy",
    "game-based learning research",
    "intrinsic motivation in education",
    "competency-based learning",
    "personalized learning pathways",
    "educational game design",
    "gamification in education",
    "K-12 learning theory",
    "homeschool learning methods",
    "student engagement strategies",
    "educational psychology",
    "learning through play",
    "flow state learning",
    "mastery-based education",
    "educational research",
  ],
  openGraph: {
    title: "Educational Philosophy | Xogos Gaming",
    description:
      "Discover the research-based educational philosophy behind Xogos Gaming and how game-based learning helps K-12 students achieve better outcomes.",
    url: "https://xogosgaming.com/educational-philosophy",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Educational Philosophy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Educational Philosophy | Xogos Gaming",
    description:
      "Discover the research-based educational philosophy behind Xogos Gaming.",
    images: ["/images/XogosLogo.png"],
  },
};

export default function EducationalPhilosophyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
