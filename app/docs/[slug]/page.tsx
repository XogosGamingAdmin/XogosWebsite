import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingLayout } from "@/layouts/Marketing";
import { getPublicDocumentBySlug, getPublicDocuments } from "@/lib/actions/publishDocumentToPublic";
import { DOCUMENT_CATEGORIES } from "@/types/published-document";
import styles from "./document.module.css";

type Props = {
  params: { slug: string };
};

// Generate static params for known documents
export async function generateStaticParams() {
  const documents = await getPublicDocuments();
  return documents.map((doc) => ({
    slug: doc.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const document = await getPublicDocumentBySlug(params.slug);

  if (!document) {
    return {
      title: "Document Not Found | Xogos Gaming",
    };
  }

  return {
    title: `${document.title} | Xogos Gaming`,
    description: document.description,
    openGraph: {
      title: document.title,
      description: document.description,
      type: "article",
      publishedTime: document.publishedAt,
      modifiedTime: document.lastUpdated,
    },
  };
}

export default async function PublishedDocumentPage({ params }: Props) {
  const document = await getPublicDocumentBySlug(params.slug);

  if (!document) {
    notFound();
  }

  const categoryName =
    DOCUMENT_CATEGORIES.find((c) => c.id === document.category)?.name ||
    document.category;

  const formattedDate = new Date(document.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const lastUpdatedDate = new Date(document.lastUpdated).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <MarketingLayout>
      <div className={styles.documentPage}>
        {/* Background elements */}
        <div className={styles.background}>
          <div className={styles.gridPattern} />
          <div className={styles.bgGlow} />
          <div className={styles.bgGlow} />
          <div className={styles.bgGlow} />
        </div>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/docs" className={styles.backLink}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Documentation
            </Link>
            <div className={styles.headerMeta}>
              <span className={styles.category}>{categoryName}</span>
              <span className={styles.date}>Published {formattedDate}</span>
              {document.publishedAt !== document.lastUpdated && (
                <span className={styles.date}>
                  Updated {lastUpdatedDate}
                </span>
              )}
            </div>
            <h1 className={styles.title}>{document.title}</h1>
            <p className={styles.description}>{document.description}</p>
            <div className={styles.author}>
              By {document.authorName}
            </div>
          </div>
        </header>

        {/* Table of Contents (if chapters exist) */}
        {document.chapters.length > 0 && (
          <nav className={styles.tableOfContents}>
            <div className={styles.tocContent}>
              <h2 className={styles.tocTitle}>Table of Contents</h2>
              <ul className={styles.tocList}>
                {document.chapters.map((chapter, index) => (
                  <li key={chapter.id} className={styles.tocItem}>
                    <a href={`#${chapter.id}`} className={styles.tocLink}>
                      <span className={styles.tocNumber}>{index + 1}</span>
                      {chapter.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {/* Main content */}
        <main className={styles.content}>
          <article
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </main>

        {/* Footer navigation */}
        <footer className={styles.footer}>
          <Link href="/docs" className={styles.footerLink}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Return to Documentation
          </Link>
        </footer>
      </div>
    </MarketingLayout>
  );
}
