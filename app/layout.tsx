import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/Providers";
import { auth } from "@/auth";
import "../styles/normalize.css";
import "../styles/globals.css";
import "../styles/text-editor.css";
import "../styles/text-editor-comments.css";
import "../styles/liveblocks-dark-theme.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/attributes.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://xogosgaming.com"),
  title: {
    default:
      "Xogos Gaming | Educational Games for K-12 Students, Homeschool & Teachers",
    template: "%s | Xogos Gaming",
  },
  description:
    "Xogos Gaming offers educational games for K-12 students, homeschoolers, parents, and teachers. Learn history, personal finance, science, and math through engaging gameplay. Play, Learn, Earn rewards for education.",
  keywords: [
    "educational games",
    "homeschool games",
    "homeschool curriculum",
    "K-12 education",
    "learning games for kids",
    "educational gaming",
    "history games for students",
    "personal finance education",
    "financial literacy for kids",
    "math games",
    "science games",
    "games for teachers",
    "classroom games",
    "educational technology",
    "edtech",
    "gamified learning",
    "student rewards",
    "education rewards",
    "homeschool resources",
    "parent education tools",
    "middle school games",
    "high school educational games",
    "elementary learning games",
    "STEM games",
    "social studies games",
  ],
  authors: [{ name: "Xogos Gaming" }],
  creator: "Xogos Gaming",
  publisher: "Xogos Gaming",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xogosgaming.com",
    siteName: "Xogos Gaming",
    title:
      "Xogos Gaming | Educational Games for K-12 Students, Homeschool & Teachers",
    description:
      "Educational games for K-12 students, homeschoolers, parents, and teachers. Learn history, personal finance, science, and math through engaging gameplay.",
    images: [
      {
        url: "/images/fullLogo.jpeg",
        width: 1200,
        height: 630,
        alt: "Xogos Gaming - Play, Learn, Earn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@XogosEducation",
    creator: "@XogosEducation",
    title:
      "Xogos Gaming | Educational Games for K-12 Students, Homeschool & Teachers",
    description:
      "Educational games for K-12 students, homeschoolers, parents, and teachers. Learn history, personal finance, science, and math through engaging gameplay.",
    images: ["/images/fullLogo.jpeg"],
  },
  category: "Education",
  classification: "Educational Games",
  other: {
    "fb:app_id": "",
    "instagram:creator": "@historicalconquest",
    "pinterest:creator": "@xogos_education",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/fullLogo.jpeg" type="image/jpeg" />
        <link rel="canonical" href="https://xogosgaming.com" />
      </head>
      <body className={inter.className}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
