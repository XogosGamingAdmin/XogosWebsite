import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Documentation | Educational Gaming Resources for Teachers, Parents & Schools",
  description:
    "Access comprehensive documentation for Xogos Gaming's educational platform. Find resources for K-12 teachers, homeschool parents, and schools including curriculum alignment guides, educational frameworks, and integration documentation.",
  keywords: [
    "educational gaming documentation",
    "K-12 curriculum resources",
    "homeschool teaching resources",
    "teacher gaming guides",
    "educational standards alignment",
    "Common Core aligned games",
    "classroom integration guides",
    "educational technology documentation",
    "parent education resources",
    "school administrator resources",
    "curriculum framework",
    "educational game development",
    "student learning resources",
    "educational platform guides",
    "teaching with games",
  ],
  openGraph: {
    title: "Documentation | Xogos Gaming Educational Resources",
    description:
      "Access comprehensive documentation for teachers, homeschool parents, and schools on integrating educational gaming into K-12 curriculum.",
    url: "https://xogosgaming.com/docs",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title: "Documentation | Xogos Gaming Educational Resources",
    description:
      "Access comprehensive documentation for teachers, homeschool parents, and schools.",
    images: ["/images/XogosLogo.png"],
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
