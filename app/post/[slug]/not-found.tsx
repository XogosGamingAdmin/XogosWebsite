import Link from "next/link";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <MarketingLayout>
      <main className={styles.main}>
        <section className={styles.notFoundSection}>
          <div className={styles.notFoundContent}>
            <h1>Article Not Found</h1>
            <p>
              The article you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <Link href="/blog" className={styles.backButton}>
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
