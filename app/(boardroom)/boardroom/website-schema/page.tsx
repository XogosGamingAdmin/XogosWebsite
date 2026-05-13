"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

const siteStructure = {
  name: "xogosgaming.com",
  type: "root",
  children: [
    {
      name: "Public Pages",
      type: "category",
      children: [
        {
          name: "/",
          label: "Homepage",
          type: "page",
          description: "Arcade-themed landing page",
        },
        {
          name: "/games",
          label: "Games",
          type: "page",
          description: "10 educational games showcase",
        },
        {
          name: "/about",
          label: "About Us",
          type: "page",
          description: "Company information",
        },
        {
          name: "/blog",
          label: "Blog",
          type: "page",
          description: "700+ educational posts",
        },
        {
          name: "/contact",
          label: "Contact",
          type: "page",
          description: "Contact form",
        },
        {
          name: "/docs",
          label: "Documentation",
          type: "page",
          description: "Platform documentation",
        },
        {
          name: "/faq",
          label: "FAQ",
          type: "page",
          description: "Frequently asked questions",
        },
        {
          name: "/membership",
          label: "Membership",
          type: "page",
          description: "Membership plans",
        },
        {
          name: "/scholarships",
          label: "Scholarships",
          type: "page",
          description: "Scholarship program",
        },
        {
          name: "/forum",
          label: "Forum",
          type: "page",
          description: "Community forum",
        },
        {
          name: "/events",
          label: "Events",
          type: "page",
          description: "Upcoming events",
        },
        {
          name: "/skillsmatrix",
          label: "Skills Matrix",
          type: "page",
          description: "Public board skills",
        },
      ],
    },
    {
      name: "Board Room (Public)",
      type: "category",
      children: [
        {
          name: "/board",
          label: "Board Room",
          type: "page",
          description: "Board overview",
        },
        {
          name: "/board/members",
          label: "Members",
          type: "page",
          description: "Board member profiles",
        },
        {
          name: "/board/initiatives",
          label: "Initiatives",
          type: "page",
          description: "Public initiatives",
        },
        {
          name: "/board/risk",
          label: "Risk",
          type: "page",
          description: "Risk assessment",
        },
        {
          name: "/board/tokenomics",
          label: "Tokenomics",
          type: "page",
          description: "Token economics",
        },
        {
          name: "/board/insights",
          label: "Insights",
          type: "page",
          description: "Board insights",
        },
      ],
    },
    {
      name: "Secured Board Room",
      type: "category",
      secure: true,
      children: [
        {
          name: "/boardroom",
          label: "Menu",
          type: "page",
          description: "Board room navigation",
        },
        {
          name: "/boardroom/skills-matrix",
          label: "Skills Matrix",
          type: "page",
          description: "Interactive skills assessment",
        },
        {
          name: "/boardroom/initiatives",
          label: "Initiatives",
          type: "page",
          description: "Initiative tracking",
        },
        {
          name: "/boardroom/bylaws",
          label: "ByLaws",
          type: "page",
          description: "Corporate governance",
        },
        {
          name: "/boardroom/website-schema",
          label: "Website Schema",
          type: "page",
          description: "Site structure map",
        },
        {
          name: "/boardroom/enterprise",
          label: "Enterprise",
          type: "page",
          description: "Corporate structure",
        },
      ],
    },
    {
      name: "Dashboard (Secured)",
      type: "category",
      secure: true,
      children: [
        {
          name: "/dashboard",
          label: "Dashboard Home",
          type: "page",
          description: "Member dashboard",
        },
        {
          name: "/dashboard/documents",
          label: "Documents",
          type: "page",
          description: "Liveblocks documents",
        },
        {
          name: "/dashboard/documents/drafts",
          label: "Drafts",
          type: "page",
          description: "Draft documents",
        },
        {
          name: "/dashboard/profile",
          label: "Profile",
          type: "page",
          description: "User profile",
        },
        {
          name: "/dashboard/public-post",
          label: "Post Initiative",
          type: "page",
          description: "Create initiatives",
        },
      ],
    },
    {
      name: "Admin (Zack Only)",
      type: "category",
      secure: true,
      admin: true,
      children: [
        {
          name: "/admin",
          label: "Admin Hub",
          type: "page",
          description: "Admin navigation",
        },
        {
          name: "/admin/statistics",
          label: "Statistics",
          type: "page",
          description: "Update metrics",
        },
        {
          name: "/admin/financials",
          label: "Financials",
          type: "page",
          description: "Financial data",
        },
        {
          name: "/admin/posts",
          label: "Blog Posts",
          type: "page",
          description: "Manage 700+ posts",
        },
        {
          name: "/admin/images",
          label: "Image Library",
          type: "page",
          description: "Uploaded images",
        },
        {
          name: "/admin/checklists",
          label: "Checklists",
          type: "page",
          description: "Task management",
        },
        {
          name: "/admin/groups",
          label: "Groups",
          type: "page",
          description: "User group assignment",
        },
      ],
    },
    {
      name: "Finance (Audit Committee)",
      type: "category",
      secure: true,
      children: [
        {
          name: "/finance",
          label: "Financial Dashboard",
          type: "page",
          description: "Stripe + manual data",
        },
      ],
    },
    {
      name: "API Routes",
      type: "category",
      api: true,
      children: [
        {
          name: "/api/auth",
          label: "Authentication",
          type: "api",
          description: "NextAuth handlers",
        },
        {
          name: "/api/blog",
          label: "Blog API",
          type: "api",
          description: "Blog CRUD + images",
        },
        {
          name: "/api/stripe-webhook",
          label: "Stripe Webhook",
          type: "api",
          description: "Payment events",
        },
        {
          name: "/api/newsletter",
          label: "Newsletter",
          type: "api",
          description: "Subscriptions",
        },
        {
          name: "/api/initiatives",
          label: "Initiatives API",
          type: "api",
          description: "Board initiatives",
        },
        {
          name: "/api/liveblocks-auth",
          label: "Liveblocks Auth",
          type: "api",
          description: "Real-time auth",
        },
        {
          name: "/api/public-stats",
          label: "Public Stats",
          type: "api",
          description: "Member count",
        },
      ],
    },
  ],
};

interface TreeNode {
  name: string;
  label?: string;
  type: string;
  description?: string;
  secure?: boolean;
  admin?: boolean;
  api?: boolean;
  children?: TreeNode[];
}

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const isCategory = node.type === "category";
  const isPage = node.type === "page";
  const isApi = node.type === "api";

  return (
    <div className={styles.treeItem} style={{ marginLeft: level * 24 }}>
      <div
        className={`${styles.treeNode} ${isCategory ? styles.category : ""} ${
          node.secure ? styles.secure : ""
        } ${node.admin ? styles.admin : ""} ${node.api || isApi ? styles.api : ""}`}
      >
        <span className={styles.nodeIcon}>
          {isCategory ? "📁" : isApi ? "⚡" : node.secure ? "🔒" : "📄"}
        </span>
        <span className={styles.nodeName}>{node.label || node.name}</span>
        {node.description && (
          <span className={styles.nodeDesc}>{node.description}</span>
        )}
        {isPage && <span className={styles.nodePath}>{node.name}</span>}
      </div>
      {node.children && (
        <div className={styles.treeChildren}>
          {node.children.map((child, idx) => (
            <TreeItem key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WebsiteSchemaPage() {
  const totalPages = siteStructure.children.reduce((acc, cat) => {
    return acc + (cat.children?.filter((c) => c.type === "page").length || 0);
  }, 0);

  const securedPages = siteStructure.children.reduce((acc, cat) => {
    if (cat.secure) {
      return acc + (cat.children?.length || 0);
    }
    return acc;
  }, 0);

  const apiRoutes = siteStructure.children.reduce((acc, cat) => {
    if (cat.api) {
      return acc + (cat.children?.length || 0);
    }
    return acc;
  }, 0);

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
          <h1 className={styles.title}>Website Schema</h1>
          <p className={styles.subtitle}>
            Visual map of the entire Xogos Gaming website structure
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalPages}</div>
            <div className={styles.statLabel}>Total Pages</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{securedPages}</div>
            <div className={styles.statLabel}>Secured Pages</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{apiRoutes}</div>
            <div className={styles.statLabel}>API Routes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {siteStructure.children.length}
            </div>
            <div className={styles.statLabel}>Sections</div>
          </div>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>📁</span>
            <span>Category</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>📄</span>
            <span>Public Page</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>🔒</span>
            <span>Secured Page</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>⚡</span>
            <span>API Route</span>
          </div>
        </div>

        <div className={styles.treeContainer}>
          <div className={styles.treeRoot}>
            <div className={styles.rootNode}>
              <span className={styles.rootIcon}>🌐</span>
              <span className={styles.rootName}>{siteStructure.name}</span>
            </div>
            {siteStructure.children.map((child, idx) => (
              <TreeItem key={idx} node={child} level={1} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
