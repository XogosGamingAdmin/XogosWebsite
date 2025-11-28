// whitepaper/page.tsx
"use client";

import Link from "next/link";
import React from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./whitepaper.module.css";

export default function WhitepaperPage() {
  return (
    <MarketingLayout>
      <div className={styles.docsPage}>
        {/* Background elements */}
        <div className={styles.docsBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
        </div>

        <div className={styles.docsHero}>
          <Container>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Xogos Gaming Whitepaper</h1>
              <p className={styles.heroSubtitle}>
                A comprehensive overview of the Xogos Gaming platform, its
                dual-token economic model, and how it revolutionizes education
                through blockchain technology and gamified learning
              </p>
            </div>
            <div className={styles.docsGraphic}>
              <div className={styles.graphicElements}>
                <div className={styles.docElement}></div>
                <div className={styles.docElement}></div>
                <div className={styles.docElement}></div>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div className={styles.docsContainer}>
            <aside className={styles.sidebarContainer}>
              <div className={styles.sidebar}>
                <div className={styles.tableOfContents}>
                  <div className={styles.tocSticky}>
                    <h3 className={styles.sidebarTitle}>Contents</h3>
                    <ul className={styles.tocList}>
                      <li>
                        <a href="#executive-summary">1. Executive Summary</a>
                      </li>
                      <li>
                        <a href="#platform-components">
                          2. Platform Components
                        </a>
                        <ul>
                          <li>
                            <a href="#educational-games">
                              2.1 Educational Games
                            </a>
                          </li>
                          <li>
                            <a href="#active-incentive-programs">
                              2.2 Active Incentive Programs
                            </a>
                          </li>
                          <li>
                            <a href="#banking-system">2.3 Banking System</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#token-economics">3. Token Economics</a>
                        <ul>
                          <li>
                            <a href="#iplay-token">3.1 iPlay Token</a>
                          </li>
                          <li>
                            <a href="#iserv-token">3.2 iServ Token</a>
                          </li>
                          <li>
                            <a href="#funding-allocation">
                              3.3 Funding Allocation
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#governance-structure">
                          4. Governance Structure
                        </a>
                      </li>
                      <li>
                        <a href="#technology-infrastructure">
                          5. Technology Infrastructure
                        </a>
                        <ul>
                          <li>
                            <a href="#blockchain-architecture">
                              5.1 Hybrid Blockchain Architecture
                            </a>
                          </li>
                          <li>
                            <a href="#security-framework">
                              5.2 Security Framework
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#educational-integration">
                          6. Integration with Educational Systems
                        </a>
                      </li>
                      <li>
                        <a href="#development-timeline">
                          7. Development Timeline
                        </a>
                      </li>
                      <li>
                        <a href="#revenue-model">8. Revenue Model</a>
                      </li>
                    </ul>

                    <div className={styles.sidebarSection}>
                      <h3 className={styles.sidebarTitle}>Related Resources</h3>
                      <ul className={styles.resourceLinks}>
                        <li>
                          <Link href="/educational-philosophy">
                            Educational Philosophy
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/tokenomics-explained">
                            Detailed Tokenomics
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/technology-stack">
                            Technology Stack
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/blockchain-integration">
                            Blockchain Integration
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className={styles.docsContent}>
              <section
                id="executive-summary"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>1. Executive Summary</h2>
                <div className={styles.sectionContent}>
                  <p>
                    Xogos Gaming is an educational platform that combines gaming
                    with blockchain technology to provide students with
                    educational incentives and scholarship funding
                    opportunities. The platform operates on a dual-token system
                    that separates educational engagement from market exposure:
                  </p>
                  <ol>
                    <li>
                      <strong>iPlay Coin</strong>: A non-monetary token earned
                      by students within the Xogos Gaming Platform through
                      educational games and Active Incentive Programs.
                    </li>
                    <li>
                      <strong>iServ Coin</strong>: A monetary, on-chain
                      cryptocurrency that functions as a governance and
                      sustainability asset with a fixed maximum supply of
                      106,000,000 tokens.
                    </li>
                  </ol>
                  <p>
                    Students earn iPlay coins by playing educational games
                    covering subjects like history, personal finance, and
                    sciences, as well as through off-screen activities
                    facilitated by Active Incentive Programs (AIPs). These coins
                    can be saved in the Xogos Banking System, which applies
                    multipliers based on saving duration (e.g., 1.1x at 30 days,
                    1.25x at 60 days), and eventually converted into scholarship
                    funding for higher education.
                  </p>
                  <p>
                    The platform currently offers four educational games with
                    plans to expand to six by summer 2025 and reach 12 games by
                    February 2026. The first AIP, the iServ Volunteer App, will
                    launch in summer 2025, with three additional AIPs planned
                    for future implementation.
                  </p>
                </div>
              </section>

              <section
                id="platform-components"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>2. Platform Components</h2>
                <div className={styles.sectionContent}>
                  <h3>2.1 Educational Games</h3>
                  <p>
                    The Xogos Gaming platform currently includes four
                    educational games that combine entertainment with learning
                    objectives:
                  </p>
                  <ol>
                    <li>
                      <strong>Historical Conquest Digital</strong>: A strategic
                      history-based game that resembles Pokémon in appearance
                      and Risk in gameplay mechanics, with all cards based on
                      historical figures, events, and places. Players earn iPlay
                      coins for time spent in the game and can purchase
                      additional decks using their earned coins.
                    </li>
                    <li>
                      <strong>Debt Free Millionaire</strong>: A personal finance
                      and career simulation that teaches financial literacy
                      through practical scenarios. Players explore career paths,
                      learn about budgeting, debt management, and
                      wealth-building, earning iPlay coins as their in-game
                      avatar reaches different savings milestones.
                    </li>
                    <li>
                      <strong>Time Quest</strong>: A fast-paced challenge that
                      tests players' ability to correctly place historical
                      events, inventions, and figures in chronological order.
                      Players can use iPlay coins to purchase "helps" when
                      needed.
                    </li>
                    <li>
                      <strong>Bug and Seek</strong>: An exploration game focused
                      on entomology, where players discover, collect, and learn
                      about various insect species across different
                      environments. Players will soon be able to unlock
                      additional levels and insects using iPlay coins.
                    </li>
                  </ol>
                  <p>
                    Two additional games are planned for release by summer 2025,
                    with a target of 12 games by February 2026, coinciding with
                    the public school sales season.
                  </p>

                  <h3>2.2 Active Incentive Programs (AIPs)</h3>
                  <p>
                    AIPs extend the Xogos ecosystem beyond screens, rewarding
                    students for valuable off-screen activities:
                  </p>
                  <ol>
                    <li>
                      <strong>iServ Volunteer App</strong> (Coming Summer 2025):
                      Developed in collaboration with the University of
                      Missouri-Kansas City (UMKC), this app gamifies community
                      service by allowing non-profits to register service
                      projects where students can earn iPlay coins for
                      participation. The app will be tested in limited markets
                      in Missouri and Minnesota.
                    </li>
                    <li>
                      <strong>Active</strong> (Planned): Will incentivize
                      physical activity through partnerships with parks and
                      recreation departments, school sports programs, and
                      athletic organizations. Students will earn recognition for
                      regular participation in organized physical activities.
                    </li>
                    <li>
                      <strong>Social</strong> (Planned): Will reward structured
                      social activities that build communication skills,
                      emotional intelligence, and collaborative capabilities.
                    </li>
                    <li>
                      <strong>Tutoring Online</strong> (Planned): Will create a
                      framework for older students to help younger ones with
                      academic challenges, matching tutors and students based on
                      subject strengths and learning needs.
                    </li>
                  </ol>

                  <h3>2.3 Banking System</h3>
                  <p>
                    The Xogos Banking System serves as both a functional token
                    management tool and an educational environment for financial
                    literacy:
                  </p>
                  <ul>
                    <li>
                      Students can track earned iPlay coins and view their
                      transaction history
                    </li>
                    <li>
                      The system applies progressive multipliers to saved coins:
                      <ul>
                        <li>30 Days: 1.1x multiplier</li>
                        <li>60 Days: 1.25x multiplier</li>
                        <li>90 Days: 1.5x multiplier</li>
                        <li>180 Days: 1.75x multiplier</li>
                        <li>
                          With further increases at similar intervals over
                          extended periods
                        </li>
                      </ul>
                    </li>
                    <li>
                      Students can convert their accumulated iPlay coins into
                      scholarship funding for higher education
                    </li>
                    <li>
                      The system provides financial literacy education through
                      practical experience with saving, interest, and
                      responsible spending
                    </li>
                  </ul>
                </div>
              </section>

              <section
                id="token-economics"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>3. Token Economics</h2>
                <div className={styles.sectionContent}>
                  <h3>3.1 iPlay Token</h3>
                  <p>
                    The iPlay token is the educational utility token within the
                    Xogos ecosystem:
                  </p>
                  <ul>
                    <li>
                      <strong>Supply</strong>: Infinite with dynamic controls to
                      prevent inflation
                    </li>
                    <li>
                      <strong>Earning Mechanisms</strong>:
                      <ul>
                        <li>
                          Educational Games: Earned through gameplay and
                          achievements
                        </li>
                        <li>
                          Active Incentive Programs: Earned through off-screen
                          activities
                        </li>
                        <li>
                          Academic Achievement: Verified educational
                          accomplishments
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Daily Limit</strong>: 4-coin maximum (2 from
                      games, 2 from AIPs) to create scarcity and encourage
                      consistent engagement
                    </li>
                    <li>
                      <strong>Usage</strong>:
                      <ul>
                        <li>
                          In-game purchases for non-producing educational games
                        </li>
                        <li>Avatar and customization options</li>
                        <li>Saving for scholarship conversion</li>
                      </ul>
                    </li>
                  </ul>

                  <h3>3.2 iServ Token</h3>
                  <p>
                    The iServ token is the market-facing cryptocurrency within
                    the Xogos ecosystem:
                  </p>
                  <ul>
                    <li>
                      <strong>Supply</strong>: Fixed maximum of 106,000,000
                      tokens
                    </li>
                    <li>
                      <strong>Value Drivers</strong>:
                      <ul>
                        <li>
                          Governance Rights: Token holders who stake their coins
                          for an extended period can participate in platform
                          decisions
                        </li>
                        <li>
                          Market Operations: Enables liquidity provision and
                          economic participation
                        </li>
                        <li>
                          Scholarship Funding: Transaction fees directly support
                          educational opportunities
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Distribution</strong>:
                      <ul>
                        <li>
                          Initial allocation focused on establishing core
                          platform functionality
                        </li>
                        <li>
                          Ongoing distribution through scholarship conversion,
                          market operations, and community incentives
                        </li>
                        <li>
                          Strategic reserves maintained for future development
                          and stability
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <h3>3.3 Funding Allocation</h3>
                  <p>
                    Transaction fees (5%) from iServ token trades and revenue
                    from soul-bound NFT sales are distributed as follows:
                  </p>
                  <ul>
                    <li>
                      <strong>65%</strong> to scholarship fund
                    </li>
                    <li>
                      <strong>20%</strong> to iServ coin liquidity
                    </li>
                    <li>
                      <strong>10%</strong> to development fund
                    </li>
                    <li>
                      <strong>5%</strong> to governance fund
                    </li>
                  </ul>
                  <p>
                    This allocation ensures sustainable funding for scholarships
                    while maintaining the liquidity, development, and governance
                    of the Xogos ecosystem.
                  </p>
                </div>
              </section>

              <section
                id="governance-structure"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>4. Governance Structure</h2>
                <div className={styles.sectionContent}>
                  <p>
                    Xogos implements a three-tier governance structure to ensure
                    appropriate stakeholder participation while maintaining
                    necessary controls:
                  </p>
                  <ul>
                    <li>
                      <strong>Board Governance</strong>: Handles platform
                      liability and core economic parameters, including:
                      <ul>
                        <li>Major system changes and protocol updates</li>
                        <li>Regulatory compliance and legal oversight</li>
                        <li>Core economic parameter adjustments</li>
                        <li>
                          Strategic partnerships and expansion initiatives
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Staker Governance</strong>: Manages day-to-day
                      operational decisions and minor parameter adjustments,
                      including:
                      <ul>
                        <li>
                          Operational decisions affecting platform functionality
                        </li>
                        <li>
                          Minor parameter adjustments within board-defined
                          boundaries
                        </li>
                        <li>Community initiatives and engagement programs</li>
                        <li>Feature requests and prioritization</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Student Input</strong>: Provides feedback on
                      game-related decisions and community features, including:
                      <ul>
                        <li>Game feature suggestions and improvements</li>
                        <li>User interface and experience feedback</li>
                        <li>Community event ideas and participation</li>
                        <li>Content preferences and educational suggestions</li>
                      </ul>
                    </li>
                  </ul>
                  <p>
                    This structure enables democratic participation while
                    protecting core economic stability through carefully
                    designed voting mechanisms and proposal systems.
                  </p>
                </div>
              </section>

              <section
                id="technology-infrastructure"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>
                  5. Technology Infrastructure
                </h2>
                <div className={styles.sectionContent}>
                  <h3>5.1 Hybrid Blockchain Architecture</h3>
                  <p>
                    The platform uses a three-layer approach that balances
                    security, privacy, and performance:
                  </p>
                  <ul>
                    <li>
                      <strong>Public-Facing Blockchain Layer</strong>: Handles
                      all economic transactions and stores aggregated,
                      anonymized educational data on the Polygon network. This
                      layer provides the transparency and immutability benefits
                      of blockchain while leveraging Polygon's fast transaction
                      times (seconds rather than minutes) and low fees (often
                      less than a penny per transaction).
                    </li>
                    <li>
                      <strong>Protected Data Layer</strong>: Stores sensitive
                      student information in traditional, highly-secured
                      PostgreSQL databases with carefully designed security
                      measures. This ensures that personal information remains
                      protected while still being available for educational
                      purposes.
                    </li>
                    <li>
                      <strong>Integration Services Layer</strong>: Connects the
                      blockchain and traditional systems through secure API
                      gateways and synchronization mechanisms. This allows
                      educational achievements in the protected layer to be
                      recognized and rewarded on the blockchain without exposing
                      personal information.
                    </li>
                  </ul>

                  <h3>5.2 Security Framework</h3>
                  <p>
                    As a platform serving minors and involving digital tokens,
                    Xogos implements exceptional security measures:
                  </p>
                  <ul>
                    <li>
                      <strong>Multi-Signature Authorization</strong>: Critical
                      system operations require approval from multiple
                      authorized individuals, preventing a single compromised
                      account from making unauthorized changes.
                    </li>
                    <li>
                      <strong>Custodial Operation Model</strong>: Students never
                      directly control blockchain private keys, preventing
                      unauthorized transactions while providing appropriate
                      supervision based on age and capability.
                    </li>
                    <li>
                      <strong>Guardian Approval System</strong>: Significant
                      actions require authorization from appropriate adults
                      through a sophisticated multi-signature framework,
                      mirroring how schools require parent/guardian permission
                      for certain activities.
                    </li>
                    <li>
                      <strong>Field-Level Encryption</strong>: Sensitive data
                      elements receive individual encryption with separate key
                      management, providing stronger protection than simply
                      encrypting entire databases.
                    </li>
                    <li>
                      <strong>Age-Appropriate Transaction Limits</strong>: The
                      system enforces caps on token transactions based on user
                      age, similar to how different age groups might have
                      different borrowing limits at a library.
                    </li>
                  </ul>
                </div>
              </section>

              <section
                id="educational-integration"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>
                  6. Integration with Educational Systems
                </h2>
                <div className={styles.sectionContent}>
                  <p>
                    Educational regulations vary significantly across states,
                    necessitating a flexible and adaptive approach to
                    integration. Xogos Gaming offers:
                  </p>
                  <ul>
                    <li>
                      <strong>State-Specific Compliance</strong>: Thorough
                      reviews of state-specific educational regulations and
                      curriculum standards ensure alignment with local
                      guidelines through:
                      <ul>
                        <li>
                          Collaboration with legal and educational consultants
                        </li>
                        <li>
                          Regular updates to stay aligned with evolving
                          educational laws
                        </li>
                        <li>
                          Direct engagement with state educational authorities
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Adaptable Program Structures</strong>: Modular and
                      customizable game-based learning experiences that align
                      with different curriculum standards:
                      <ul>
                        <li>
                          Replacement of underappreciated state-provided
                          programs with gamified equivalents
                        </li>
                        <li>
                          Flexibility to accommodate unique educational goals
                          and requirements
                        </li>
                        <li>
                          Tools for educators to modify curriculum-specific
                          gaming modules
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Institution-Specific Solutions</strong>: Tailored
                      options for different educational environments:
                      <ul>
                        <li>
                          <strong>Public Schools</strong>: Alignment with state
                          standards and integration with existing programs
                        </li>
                        <li>
                          <strong>Private Schools</strong>: Customization to
                          complement individual school curriculums
                        </li>
                        <li>
                          <strong>Faith-Based Schools</strong>: Optional
                          faith-based educational content specific to each
                          institution
                        </li>
                        <li>
                          <strong>Homeschooling Networks</strong>: Flexible
                          resources for parents to integrate gaming into their
                          routines
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </section>

              <section
                id="development-timeline"
                className={styles.whitepaperSection}
              >
                <h2 className={styles.sectionTitle}>7. Development Timeline</h2>
                <div className={styles.sectionContent}>
                  <p>
                    Xogos Gaming has established a clear roadmap for short-term
                    and long-term development:
                  </p>
                  <h3>7.1 Short-Term Milestones (2025-2026)</h3>
                  <ul>
                    <li>
                      <strong>May 2025</strong>: iServ Coin enters open market,
                      initiating funding campaign to attract non-profit and
                      for-profit companies interested in supporting the first
                      major scholarship fund.
                    </li>
                    <li>
                      <strong>Summer 2025</strong>: iServ Volunteer AIP launch
                      and testing in limited markets of Missouri and Minnesota,
                      with over 100 students participating.
                    </li>
                    <li>
                      <strong>Summer 2025</strong>: Addition of two new games to
                      the platform before the official release of the iServ
                      Volunteer System.
                    </li>
                    <li>
                      <strong>February 2026</strong>: Target of 12 games on
                      platform, just in time for the Public-School sales season.
                    </li>
                    <li>
                      <strong>Summer 2026</strong>: Development and release of
                      Physical Education Active AIP for testing and evaluation.
                    </li>
                  </ul>

                  <h3>7.2 Long-Term Milestones (2027-2029)</h3>
                  <ul>
                    <li>
                      <strong>Summer 2027</strong>: Completion of all four
                      planned AIPs, including the Social and Tutoring Online
                      programs.
                    </li>
                    <li>
                      <strong>2027-2029</strong>: Expansion of game library to
                      include over 30 games covering a wide range of K-12
                      subjects.
                    </li>
                    <li>
                      <strong>2029</strong>: Target of 67 school district
                      partnerships reaching over 700 schools across the United
                      States.
                    </li>
                  </ul>
                  <p>
                    With each new game and AIP, Xogos Gaming will publish
                    scientific, data-based research that schools can use to
                    improve student outcomes. If a program fails to deliver
                    strong results, it will be continuously modified and
                    improved to guarantee optimal student engagement and
                    learning outcomes.
                  </p>
                </div>
              </section>

              <section id="revenue-model" className={styles.whitepaperSection}>
                <h2 className={styles.sectionTitle}>8. Revenue Model</h2>
                <div className={styles.sectionContent}>
                  <p>
                    Xogos Gaming has built a multi-layered business model
                    designed to support its long-term vision of merging
                    education, gaming, and financial incentives. The company
                    generates revenue through:
                  </p>
                  <ul>
                    <li>
                      <strong>Monthly Subscriptions</strong>: Individual users
                      and students pay a monthly fee for access to the Xogos
                      Gaming Platform and its expanding library of educational
                      games. This revenue funds the daily operations of Xogos
                      Gaming, including server maintenance, customer support,
                      and content updates.
                    </li>
                    <li>
                      <strong>School Contracts</strong>: Educational
                      institutions purchase annual licenses that allow educators
                      to integrate Xogos into their classrooms, providing bulk
                      access for their students.
                    </li>
                    <li>
                      <strong>NFT Sales</strong>: Corporate sponsors and
                      philanthropists purchase soul-bound NFTs that serve as a
                      permanent record of their contributions to education.
                      These NFTs act as a marketing and goodwill tool, allowing
                      companies to demonstrate their commitment to funding
                      scholarships for students.
                    </li>
                    <li>
                      <strong>Transaction Fees</strong>: A 5% fee on iServ token
                      trades creates a sustainable source of funding for
                      scholarships, liquidity, development, and governance.
                    </li>
                    <li>
                      <strong>Licensing</strong>: Some Xogos games may be
                      available on external platforms, including Steam, the Epic
                      Games Store, and educational software marketplaces,
                      generating additional revenue through game sales and
                      licensing fees.
                    </li>
                  </ul>
                  <p>
                    This diverse revenue model ensures that Xogos Gaming can
                    maintain financial sustainability while fulfilling its
                    mission of providing educational engagement and scholarship
                    opportunities for students.
                  </p>
                </div>
              </section>

              <div className={styles.documentFooter}>
                <p className={styles.lastUpdated}>
                  Last Updated: March 15, 2025
                </p>
                <div className={styles.footerLinks}>
                  <Link href="/docs" className={styles.footerLink}>
                    Back to Documents
                  </Link>
                  <Link
                    href="/educational-philosophy"
                    className={styles.footerLink}
                  >
                    Next: Educational Philosophy →
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </Container>
      </div>
    </MarketingLayout>
  );
}
