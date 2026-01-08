"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { DOCUMENT_CATEGORIES, PublishedDocument } from "@/types/published-document";
import styles from "./docs.module.css";

// Document type for internal use
interface DocumentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
  link: string;
  chapters: { id: string; title: string; description?: string }[];
  isPublished?: boolean;
}

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishedDocs, setPublishedDocs] = useState<DocumentItem[]>([]);

  // Fetch published documents on mount
  useEffect(() => {
    async function fetchPublishedDocs() {
      try {
        const response = await fetch("/api/public-documents");
        const data = await response.json();
        const formatted: DocumentItem[] = (data.documents || []).map((doc: PublishedDocument) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          description: doc.description,
          lastUpdated: new Date(doc.lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          link: `/docs/${doc.id}`,
          chapters: doc.chapters,
          isPublished: true,
        }));
        setPublishedDocs(formatted);
      } catch (error) {
        console.error("Error fetching published documents:", error);
      }
    }
    fetchPublishedDocs();
  }, []);

  // Document categories - includes all possible categories
  const categories = [
    { id: "all", name: "All Documents" },
    ...DOCUMENT_CATEGORIES,
  ];

  // Document data
  const documents = [
    {
      id: "whitepaper",
      title: "Xogos Gaming Whitepaper",
      category: "whitepaper",
      description:
        "The foundational document outlining Xogos Gamings vision, mission, and approach to revolutionizing educational gaming through blockchain technology.",
      lastUpdated: "March 10, 2025",
      link: "/whitepaper",
      chapters: [
        {
          id: "intro",
          title: "Introduction & Vision",
          description:
            "Overview of Xogos Gamings mission and vision for educational gaming",
        },
        {
          id: "problem",
          title: "Problem Statement",
          description: "Educational challenges Xogos Gaming aims to solve",
        },
        {
          id: "solution",
          title: "Solution Framework",
          description: "How our platform addresses educational needs",
        },
        {
          id: "tech",
          title: "Technology Stack",
          description: "Technical overview of our platform architecture",
        },
        {
          id: "tokenomics",
          title: "Tokenomics & Rewards",
          description: "Economic structure of the Xogos ecosystem",
        },
        {
          id: "roadmap",
          title: "Development Roadmap",
          description: "Future milestones and planned features",
        },
      ],
    },
    {
      id: "educational-games",
      title: "Educational Games Development Framework",
      category: "education",
      description:
        "Comprehensive overview of our approach to creating effective, curriculum-aligned educational games that engage students.",
      lastUpdated: "February 15, 2025",
      link: "/educational-framework",
      chapters: [
        {
          id: "pedagogy",
          title: "Pedagogical Approach",
          description: "Educational principles guiding game development",
        },
        {
          id: "curriculum",
          title: "Curriculum Alignment",
          description: "How games map to educational standards",
        },
        {
          id: "engagement",
          title: "Student Engagement Strategies",
          description: "Methods for maintaining student interest",
        },
        {
          id: "assessment",
          title: "Learning Assessment",
          description: "Measuring educational outcomes through gameplay",
        },
      ],
    },
    {
      id: "crypto-education",
      title: "Cryptocurrency Education & Integration Guide",
      category: "blockchain",
      description:
        "Details on our approach to integrating cryptocurrency concepts into educational platforms in an age-appropriate manner.",
      lastUpdated: "January 28, 2025",
      link: "/docs/crypto-education",
      chapters: [
        {
          id: "basics",
          title: "Blockchain Basics for Students",
          description: "Age-appropriate introduction to blockchain",
        },
        {
          id: "wallet",
          title: "Student Wallet System",
          description: "Secure cryptocurrency storage for students",
        },
        {
          id: "rewards",
          title: "Educational Achievement Rewards",
          description: "Token distribution based on learning milestones",
        },
        {
          id: "parental",
          title: "Parental Controls & Oversight",
          description:
            "Safety mechanisms for student cryptocurrency interaction",
        },
      ],
    },
    {
      id: "standards-alignment",
      title: "Educational Standards Alignment Documentation",
      category: "education",
      description:
        "Reference materials for how Xogos Gaming content aligns with educational standards across different regions and grade levels.",
      lastUpdated: "February 5, 2025",
      link: "/docs/standards",
      chapters: [
        {
          id: "common-core",
          title: "Common Core Alignment",
          description: "Mapping to US Common Core standards",
        },
        {
          id: "state",
          title: "State-by-State Requirements",
          description: "State-specific educational requirements",
        },
        {
          id: "international",
          title: "International Standards",
          description: "Alignment with international educational frameworks",
        },
        {
          id: "lifeskills",
          title: "Life Skills Integration",
          description: "Beyond-curriculum content for practical skills",
        },
      ],
    },
    {
      id: "blockchain-scholarship",
      title: "Blockchain Scholarship Platform Whitepaper",
      category: "blockchain",
      description:
        "Technical and operational overview of our transparent blockchain-based scholarship funding and distribution system.",
      lastUpdated: "January 10, 2025",
      link: "/docs/scholarship-platform",
      chapters: [
        {
          id: "funding",
          title: "Funding Mechanisms",
          description: "How scholarships are funded through the platform",
        },
        {
          id: "eligibility",
          title: "Eligibility Criteria",
          description: "Requirements for scholarship qualification",
        },
        {
          id: "distribution",
          title: "Fund Distribution",
          description: "Secure and transparent fund allocation process",
        },
        {
          id: "verification",
          title: "Achievement Verification",
          description: "Blockchain verification of educational accomplishments",
        },
      ],
    },
    {
      id: "legal-framework",
      title: "Legal & Regulatory Compliance Framework",
      category: "legal",
      description:
        "Overview of Xogos Gamings approach to legal and regulatory compliance across educational and cryptocurrency domains.",
      lastUpdated: "March 1, 2025",
      link: "/docs/legal-framework",
      chapters: [
        {
          id: "education-law",
          title: "Educational Regulations",
          description: "Compliance with educational privacy laws",
        },
        {
          id: "crypto-regulation",
          title: "Cryptocurrency Regulations",
          description: "Compliance with financial regulations",
        },
        {
          id: "privacy",
          title: "Student Data Privacy",
          description: "Protection of student information",
        },
        {
          id: "scholarship-law",
          title: "Scholarship Legal Structure",
          description: "Legal framework for scholarship disbursement",
        },
      ],
    },
    {
      id: "tokenomics-explanation",
      title: "Xogos Tokenomics Explained",
      category: "tokenomics",
      description:
        "Comprehensive explanation of Xogos token economics, including token utility, distribution, and governance.",
      lastUpdated: "February 20, 2025",
      link: "/docs/tokenomics",
      chapters: [
        {
          id: "model",
          title: "Economic Model",
          description: "Structure of the Xogos token economy",
        },
        {
          id: "distribution",
          title: "Token Distribution",
          description: "Allocation of tokens across stakeholders",
        },
        {
          id: "utility",
          title: "Token Utility",
          description: "Use cases for Xogos tokens within the ecosystem",
        },
        {
          id: "governance",
          title: "Governance Structure",
          description: "Community governance mechanisms",
        },
      ],
    },
    {
      id: "api-documentation",
      title: "Developer API Documentation",
      category: "technical",
      description:
        "Technical documentation for developers looking to integrate with or build upon the Xogos Gaming platform.",
      lastUpdated: "January 15, 2025",
      link: "/docs/api",
      chapters: [
        {
          id: "auth",
          title: "Authentication",
          description: "Secure access to Xogos APIs",
        },
        {
          id: "game-api",
          title: "Game Integration API",
          description: "Building educational games on the platform",
        },
        {
          id: "wallet-api",
          title: "Wallet Integration",
          description: "Connecting to student wallet systems",
        },
        {
          id: "analytics",
          title: "Analytics API",
          description: "Accessing educational performance data",
        },
      ],
    },
    {
      id: "security-framework",
      title: "Security and Trust Framework",
      category: "technical",
      description:
        "Detailed documentation on Xogos Gamings approach to security, data protection, and building trust with educational institutions.",
      lastUpdated: "March 5, 2025",
      link: "/docs/security",
      chapters: [
        {
          id: "data-protection",
          title: "Data Protection Measures",
          description: "Safeguarding student information",
        },
        {
          id: "blockchain-security",
          title: "Blockchain Security",
          description: "Secure cryptocurrency transactions",
        },
        {
          id: "compliance",
          title: "Security Compliance",
          description: "Meeting industry security standards",
        },
        {
          id: "incident",
          title: "Incident Response",
          description: "Protocols for security incidents",
        },
      ],
    },
  ];

  // Merge static and published documents (published first, then static)
  const allDocuments: DocumentItem[] = [...publishedDocs, ...documents];

  // Filter documents based on active category and search query
  const filteredDocuments = allDocuments.filter((doc) => {
    const matchesCategory =
      activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.chapters.some(
        (chapter) =>
          chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (chapter.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <MarketingLayout>
      <div className={styles.docsPage}>
        <div className={styles.docsHero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Documentation</h1>
            <p className={styles.heroSubtitle}>
              Comprehensive resources to understand Xogos Gaming's educational
              platform, blockchain integration, and game development
            </p>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className={styles.searchIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.docsGraphic}>
            <div className={styles.graphicElements}></div>
          </div>
        </div>

        <div className={styles.docsContainer}>
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Document Categories</h3>
              <ul className={styles.categoryList}>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ""}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Quick Links</h3>
                <ul className={styles.quickLinks}>
                  <li>
                    <Link href="/whitepaper">Whitepaper</Link>
                  </li>
                  <li>
                    <Link href="/tokenomics">Tokenomics</Link>
                  </li>
                  <li>
                    <Link href="/docs/api">Developer API</Link>
                  </li>
                  <li>
                    <Link href="/docs/legal-framework">Legal Framework</Link>
                  </li>
                </ul>
              </div>

              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Resources</h3>
                <ul className={styles.resourceLinks}>
                  <li>
                    <Link href="/app/boardinitiatives">Board Initiatives</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact Support</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.docsContent}>
            <div className={styles.categoryHeader}>
              <h2>
                {categories.find((cat) => cat.id === activeCategory)?.name ||
                  "All Documents"}
              </h2>
              <p className={styles.docCount}>
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className={styles.documentsGrid}>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <div key={document.id} className={styles.documentCard}>
                    <div className={styles.documentHeader}>
                      <div className={styles.documentCategory}>
                        {
                          categories.find((cat) => cat.id === document.category)
                            ?.name
                        }
                      </div>
                      <div className={styles.documentDate}>
                        Updated: {document.lastUpdated}
                      </div>
                    </div>
                    <h3 className={styles.documentTitle}>{document.title}</h3>
                    <p className={styles.documentDescription}>
                      {document.description}
                    </p>

                    <div className={styles.chaptersContainer}>
                      <h4 className={styles.chaptersTitle}>Contents</h4>
                      <ul className={styles.chaptersList}>
                        {document.chapters.map((chapter) => (
                          <li key={chapter.id} className={styles.chapterItem}>
                            <div className={styles.chapterTitle}>
                              {chapter.title}
                            </div>
                            <div className={styles.chapterDescription}>
                              {chapter.description}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={document.link} className={styles.readButton}>
                      Read Full Document
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                  <h3>No documents found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button
                    className={styles.resetButton}
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
