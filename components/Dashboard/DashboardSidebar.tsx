import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ComponentProps, useMemo } from "react";
import {
  DASHBOARD_HOME_URL,
  DASHBOARD_DOCUMENTS_URL,
  DASHBOARD_PROFILE_URL,
  DASHBOARD_DOCUMENTS_GROUP_URL,
  ADMIN_URL,
} from "@/constants";
import { FileIcon, FolderIcon, HomeIcon, UserIcon } from "@/icons";
import { isAdmin } from "@/lib/auth/admin";
import { LinkButton } from "@/primitives/Button";
import { Group } from "@/types";
import { normalizeTrailingSlash } from "@/utils";
import styles from "./DashboardSidebar.module.css";

interface Props extends ComponentProps<"div"> {
  groups: Group[];
}

interface SidebarLinkProps
  extends Omit<ComponentProps<typeof LinkButton>, "href"> {
  href: string;
}

function SidebarLink({
  href,
  children,
  className,
  ...props
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = useMemo(
    () => normalizeTrailingSlash(pathname) === normalizeTrailingSlash(href),
    [pathname, href]
  );

  return (
    <LinkButton
      className={clsx(className, styles.sidebarLink)}
      data-active={isActive || undefined}
      href={href}
      variant="subtle"
      {...props}
    >
      {children}
    </LinkButton>
  );
}

export function DashboardSidebar({ className, groups, ...props }: Props) {
  const { data: session } = useSession();
  const userIsAdmin = session?.user?.email ? isAdmin(session.user.email) : false;

  return (
    <div className={clsx(className, styles.sidebar)} {...props}>
      <nav className={styles.navigation}>
        <div className={styles.category}>
          <ul className={styles.list}>
            <li>
              <SidebarLink href={DASHBOARD_HOME_URL} icon={<HomeIcon />}>
                Home
              </SidebarLink>
            </li>
            <li>
              <SidebarLink href={DASHBOARD_DOCUMENTS_URL} icon={<FileIcon />}>
                Documents
              </SidebarLink>
            </li>
            <li>
              <SidebarLink href={DASHBOARD_PROFILE_URL} icon={<UserIcon />}>
                Profile
              </SidebarLink>
            </li>
            {userIsAdmin && (
              <li>
                <SidebarLink href={ADMIN_URL}>
                  Admin
                </SidebarLink>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.category}>
          <span className={styles.categoryTitle}>Groups</span>
          <ul className={styles.list}>
            {groups.map((group) => {
              return (
                <li key={group.id}>
                  <SidebarLink
                    href={DASHBOARD_DOCUMENTS_GROUP_URL(group.id)}
                    icon={<FolderIcon />}
                  >
                    {group.name}
                  </SidebarLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
