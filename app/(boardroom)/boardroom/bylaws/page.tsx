"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

export default function BylawsPage() {
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
          <h1 className={styles.title}>Corporate Bylaws</h1>
          <p className={styles.subtitle}>
            Xogos Gaming Inc. Official Bylaws - Revision 1.1.1 (April 21, 2024)
          </p>
        </div>

        <div className={styles.content}>
          {/* Mission Statement */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Mission Statement</h2>
            <div className={styles.sectionContent}>
              <p>
                Xogos Gaming is dedicated to revolutionizing educational
                experiences through interactive gaming and personalized academic
                endeavors. Our mission is to develop cutting-edge apps that not
                only engage students academically but also promote emotional and
                physical well-being.
              </p>
              <p>
                Through the innovative use of cryptocurrency within our games,
                we strive to enhance accessibility and inclusivity, enabling
                players to convert in-game achievements into educational
                opportunities, including scholarships.
              </p>
              <div className={styles.highlight}>
                <strong>Core Commitment:</strong> We hold the safety and
                security of our youth users as our highest priority. None of our
                data will ever be sold to third-party entities.
              </div>
            </div>
          </section>

          {/* Board Composition */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Board Composition</h2>
            <div className={styles.sectionContent}>
              <p>
                The Board of Directors consists of <strong>seven members</strong>
                , selected based on expertise, integrity, and commitment to our
                mission.
              </p>
              <div className={styles.rolesList}>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>President</span>
                  <span className={styles.roleDesc}>
                    Leads the board, presides over meetings, ensures policies
                    are implemented
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>
                    Insurance & Liabilities
                  </span>
                  <span className={styles.roleDesc}>
                    Oversees operational risks and insurance coverage
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>Legal</span>
                  <span className={styles.roleDesc}>
                    Oversees legal aspects and compliance
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>Crypto & Exchanges</span>
                  <span className={styles.roleDesc}>
                    Manages digital currency integration and compliance
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>Fundraising</span>
                  <span className={styles.roleDesc}>
                    Leads funding initiatives through grants and partnerships
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>Accounting</span>
                  <span className={styles.roleDesc}>
                    Oversees financial reports, planning, and auditing
                  </span>
                </div>
                <div className={styles.role}>
                  <span className={styles.roleTitle}>CEO (External Relations)</span>
                  <span className={styles.roleDesc}>
                    Day-to-day management and executing board strategy
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Terms and Appointments */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Terms & Appointments</h2>
            <div className={styles.sectionContent}>
              <div className={styles.keyPoints}>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Initial Term</span>
                  <span className={styles.keyValue}>1 Year</span>
                </div>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Subsequent Terms</span>
                  <span className={styles.keyValue}>3 Years</span>
                </div>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Election Requirement</span>
                  <span className={styles.keyValue}>2/3 Majority Vote</span>
                </div>
              </div>
              <h3 className={styles.subsectionTitle}>Succession & Removal</h3>
              <ul className={styles.list}>
                <li>
                  Mid-term vacancies filled by interim appointment until next
                  annual meeting
                </li>
                <li>
                  Resignations effective upon written notice to Board President
                </li>
                <li>
                  Directors may be removed with 2/3 majority vote for failure to
                  fulfill duties
                </li>
                <li>
                  <strong>CEO removal requires unanimous vote</strong> by all
                  other board members with proof of breach
                </li>
              </ul>
            </div>
          </section>

          {/* Meetings */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Meetings</h2>
            <div className={styles.sectionContent}>
              <div className={styles.keyPoints}>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Quorum</span>
                  <span className={styles.keyValue}>4 of 7 Members</span>
                </div>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Standard Decisions</span>
                  <span className={styles.keyValue}>Simple Majority</span>
                </div>
                <div className={styles.keyPoint}>
                  <span className={styles.keyLabel}>Critical Decisions</span>
                  <span className={styles.keyValue}>2/3 Majority</span>
                </div>
              </div>
              <ul className={styles.list}>
                <li>
                  Initial phase: bi-weekly meetings; transitions to monthly once
                  established
                </li>
                <li>
                  Agenda set by President in consultation with board and CEO
                </li>
                <li>
                  Remote participation via teleconference counts toward quorum
                </li>
                <li>Materials distributed at least 3 days before meetings</li>
              </ul>
            </div>
          </section>

          {/* Director Duties */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Director Duties</h2>
            <div className={styles.sectionContent}>
              <div className={styles.dutiesGrid}>
                <div className={styles.duty}>
                  <h4>Duty of Care</h4>
                  <p>
                    Perform duties with the care an ordinarily prudent person
                    would exercise
                  </p>
                </div>
                <div className={styles.duty}>
                  <h4>Duty of Loyalty</h4>
                  <p>
                    Act in good faith in the best interests of Xogos Gaming, not
                    personal interests
                  </p>
                </div>
                <div className={styles.duty}>
                  <h4>Duty of Obedience</h4>
                  <p>
                    Adhere to all applicable laws and the company&apos;s mission
                    and bylaws
                  </p>
                </div>
              </div>
              <h3 className={styles.subsectionTitle}>Requirements</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Attendance:</strong> Minimum 75% of all board meetings
                  annually
                </li>
                <li>
                  <strong>Preparation:</strong> Review all materials before
                  meetings
                </li>
                <li>
                  <strong>Conflict of Interest:</strong> Must disclose any
                  conflicts; annual questionnaire required
                </li>
              </ul>
            </div>
          </section>

          {/* Financial Oversight */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Financial Oversight</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subsectionTitle}>Budget Process</h3>
              <ul className={styles.list}>
                <li>
                  Annual budget prepared 2 months before fiscal year start
                </li>
                <li>Board approval required 1 month before fiscal year</li>
                <li>Quarterly financial reports to the board</li>
              </ul>
              <h3 className={styles.subsectionTitle}>Audit Requirements</h3>
              <ul className={styles.list}>
                <li>
                  Independent external auditor appointed by the board annually
                </li>
                <li>
                  <strong>Financial Audit:</strong> Annual statements audited
                  for GAAP compliance
                </li>
                <li>
                  <strong>Cryptocurrency Audit:</strong> Platform code and
                  ledger audited for all iPlay and iServ coin transactions
                </li>
                <li>
                  Audit Committee (3+ members not in day-to-day management)
                  oversees process
                </li>
                <li>Public declaration of annual audit results</li>
              </ul>
            </div>
          </section>

          {/* Amendments */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Amendments</h2>
            <div className={styles.sectionContent}>
              <div className={styles.highlight}>
                Bylaw amendments require a{" "}
                <strong>two-thirds majority vote</strong> of all sitting board
                members.
              </div>
              <ul className={styles.list}>
                <li>Any board member may propose amendments in writing</li>
                <li>30 days notice required before vote</li>
                <li>Amendments effective immediately upon approval</li>
              </ul>
            </div>
          </section>

          {/* Legal Compliance */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Legal Compliance</h2>
            <div className={styles.sectionContent}>
              <p>
                Xogos Gaming operates in accordance with all applicable laws at
                local, state, federal, and international levels.
              </p>
              <div className={styles.highlight}>
                <strong>Cryptocurrency Focus:</strong> Particular attention to
                SEC, FinCEN, and international financial regulations governing
                digital currencies.
              </div>
              <ul className={styles.list}>
                <li>Regular compliance training for employees and board</li>
                <li>
                  Whistleblower protection for reporting non-compliance
                </li>
                <li>Periodic external compliance audits</li>
              </ul>
            </div>
          </section>

          {/* Indemnification */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Indemnification</h2>
            <div className={styles.sectionContent}>
              <p>
                Xogos Gaming indemnifies directors, officers, employees, and
                agents who acted in good faith and in the best interests of the
                company. This covers expenses, attorneys&apos; fees, judgments,
                fines, and settlement amounts.
              </p>
              <ul className={styles.list}>
                <li>
                  Good faith requirement: Actions must be reasonably believed to
                  be in company&apos;s best interest
                </li>
                <li>
                  Expenses may be advanced pending final disposition
                </li>
                <li>
                  Company may purchase liability insurance for directors and
                  officers
                </li>
              </ul>
            </div>
          </section>

          <div className={styles.footer}>
            <p>
              <em>
                This document contains confidential information. Full bylaws
                document available upon request to board members.
              </em>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
