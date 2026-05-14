"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface Product {
  name: string;
  url?: string;
  category?: string;
  comingSoon?: boolean;
}

interface Subsidiary {
  name: string;
  type: string;
  description: string;
  color: string;
  products: Product[];
}

const corporateStructure: {
  parent: { name: string; type: string; description: string; color: string };
  subsidiaries: Subsidiary[];
  nonprofit: { name: string; type: string; description: string; color: string; relationship: string };
} = {
  parent: {
    name: "Xogos Education",
    type: "Parent Company",
    description: "Educational technology holding company",
    color: "#e62739",
  },
  subsidiaries: [
    {
      name: "Xogos Gaming",
      type: "LLC",
      description: "Educational gaming platform and game development",
      color: "#7928ca",
      products: [
        { name: "Xogos Gaming", url: "www.XogosGaming.com" },
        { name: "Xogos Bank", url: "www.XogosGaming.com" },
        { name: "ScienceHub", category: "Sciences", url: "ScienceHub.com" },
        {
          name: "MedicalDiagnosis",
          category: "Medical",
          url: "www.medicaldiagnosis.rocks",
        },
        { name: "PressPass", category: "Journalism", url: "www.prepass.rocks" },
        {
          name: "Shakespeare's Conspiracy",
          category: "English",
          url: "www.theshakespearegame.com",
        },
        { name: "TimeQuest", category: "History", url: "www.timequest.rocks" },
        { name: "GeoTag", category: "Geography", url: "www.geotag.rocks" },
        { name: "HuntThePast", url: "www.huntthepast.com" },
        {
          name: "Lifeskills Academy",
          category: "Life Skills",
          url: "www.lifeskillsacademy.rocks",
        },
        {
          name: "Lightning Round",
          category: "Stealth Testing",
          url: "lightninground.rocks",
        },
        {
          name: "Digital Frontier",
          category: "Engineering",
          url: "www.digitalfrontiergame.com",
        },
        { name: "iServ", category: "Active Incentives", url: "www.iservapp.org" },
        { name: "Monster Math", category: "Math", url: "www.monstermathgames.com" },
        {
          name: "Totally Medieval",
          category: "Math & History",
          url: "www.thetotallymedievalgame.com",
        },
        { name: "Trade Academy", url: "www.tradeacademy.com" },
        {
          name: "Battles and Thrones",
          category: "History",
          url: "www.battlesandthrones.com",
          comingSoon: true,
        },
      ],
    },
    {
      name: "Debt Free Millionaire",
      type: "LLC",
      description: "Financial literacy education and courses",
      color: "#f59e0b",
      products: [
        { name: "Educational Courses" },
        { name: "Educational Games" },
      ],
    },
    {
      name: "Xogos AI",
      type: "LLC",
      description: "Artificial intelligence and machine learning solutions",
      color: "#2dd4bf",
      products: [
        { name: "XogosAI", url: "www.XogosAI.com" },
        { name: "RankAI", url: "rankAI.xogosai.com" },
      ],
    },
    {
      name: "Xogos Media",
      type: "LLC",
      description: "Content production and digital media services",
      color: "#3b82f6",
      products: [
        { name: "SocialHub", url: "www.socialhub.rocks" },
        { name: "XogosAudio", url: "www.xogosaudio.com" },
      ],
    },
    {
      name: "MyLearningSource",
      type: "LLC",
      description: "Educational platform and curriculum development",
      color: "#8b5cf6",
      products: [],
    },
    {
      name: "Xogos Domain",
      type: "LLC",
      description: "Digital infrastructure and domain management",
      color: "#ec4899",
      products: [],
    },
  ],
  nonprofit: {
    name: "Innovate the Future",
    type: "501(c)(3) Non-Profit",
    description:
      "Provides scholarship funding and educational grants to support students through Xogos Gaming programs",
    color: "#22c55e",
    relationship: "Scholarship Funding Partner",
  },
};

export default function EnterprisePage() {
  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.grid}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.backLink}>
          <Link href="/boardroom">← Back to Board Room</Link>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Xogos Enterprise</h1>
          <p className={styles.subtitle}>
            Corporate structure and subsidiary overview
          </p>
        </div>

        <div className={styles.orgChart}>
          {/* Parent Company */}
          <div className={styles.parentSection}>
            <div
              className={styles.parentCard}
              style={
                {
                  "--card-color": corporateStructure.parent.color,
                } as React.CSSProperties
              }
            >
              <div className={styles.cardAccent}></div>
              <div className={styles.cardBadge}>
                {corporateStructure.parent.type}
              </div>
              <div className={styles.cardIcon}>🎓</div>
              <h2 className={styles.cardName}>
                {corporateStructure.parent.name}
              </h2>
              <p className={styles.cardDescription}>
                {corporateStructure.parent.description}
              </p>
            </div>
          </div>

          {/* Connection Lines */}
          <div className={styles.connections}>
            <div className={styles.verticalLine}></div>
            <div className={styles.horizontalLine}></div>
          </div>

          {/* Subsidiaries with Products */}
          <div className={styles.subsidiariesSection}>
            <h3 className={styles.sectionTitle}>Subsidiary Companies</h3>
            <div className={styles.subsidiariesGrid}>
              {corporateStructure.subsidiaries.map((sub, idx) => (
                <div key={idx} className={styles.subsidiaryWrapper}>
                  <div
                    className={styles.subsidiaryCard}
                    style={{ "--card-color": sub.color } as React.CSSProperties}
                  >
                    <div className={styles.cardAccent}></div>
                    <div className={styles.cardBadge}>{sub.type}</div>
                    <h3 className={styles.subName}>{sub.name}</h3>
                    <p className={styles.subDescription}>{sub.description}</p>
                  </div>

                  {sub.products && sub.products.length > 0 && (
                    <div className={styles.productsGrid}>
                      {sub.products.map((product, pIdx) => (
                        <div
                          key={pIdx}
                          className={styles.productCard}
                          style={
                            { "--card-color": sub.color } as React.CSSProperties
                          }
                        >
                          <div className={styles.productName}>
                            {product.name}
                          </div>
                          {product.category && (
                            <div className={styles.productCategory}>
                              {product.category}
                            </div>
                          )}
                          {product.comingSoon && (
                            <div className={styles.comingSoon}>Coming Soon</div>
                          )}
                          {product.url && (
                            <div className={styles.productUrl}>
                              {product.url}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(!sub.products || sub.products.length === 0) && (
                    <div className={styles.noProducts}>
                      <span>No products yet</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Non-Profit Partner */}
          <div className={styles.nonprofitSection}>
            <div className={styles.partnershipLine}>
              <span className={styles.partnershipLabel}>
                Scholarship Funding Partnership
              </span>
            </div>
            <div
              className={styles.nonprofitCard}
              style={
                {
                  "--card-color": corporateStructure.nonprofit.color,
                } as React.CSSProperties
              }
            >
              <div className={styles.cardAccent}></div>
              <div className={styles.cardBadgeNonprofit}>
                {corporateStructure.nonprofit.type}
              </div>
              <div className={styles.cardIcon}>🎓</div>
              <h2 className={styles.cardName}>
                {corporateStructure.nonprofit.name}
              </h2>
              <p className={styles.cardDescription}>
                {corporateStructure.nonprofit.description}
              </p>
              <div className={styles.relationshipBadge}>
                <span className={styles.arrowIcon}>↔</span>
                {corporateStructure.nonprofit.relationship}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statLabel}>Parent Company</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {corporateStructure.subsidiaries.length}
            </div>
            <div className={styles.statLabel}>Subsidiaries</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {corporateStructure.subsidiaries.reduce(
                (acc, sub) => acc + (sub.products?.length || 0),
                0
              )}
            </div>
            <div className={styles.statLabel}>Products</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statLabel}>Non-Profit Partner</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
