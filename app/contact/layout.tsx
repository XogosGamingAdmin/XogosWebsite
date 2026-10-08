import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Xogos Gaming",
  description:
    "Contact the Xogos Gaming team about membership, sign-in help, classrooms, scholarships, or bringing your educational game to Xogos.",
  openGraph: {
    title: "Contact Xogos Gaming",
    description:
      "Send the Xogos team a message. A real person will reply by email.",
    url: "https://xogosgaming.com/contact",
    images: [
      {
        url: "/images/XogosLogo.png",
        width: 1200,
        height: 630,
        alt: "Contact Xogos Gaming",
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
