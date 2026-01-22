"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ADMIN_CHECKLISTS_URL,
  ADMIN_FINANCIALS_URL,
  ADMIN_STATISTICS_URL,
  DASHBOARD_HOME_URL,
  DOCUMENT_GROUPS,
} from "@/constants";
import { getUsersWithGroups } from "@/lib/actions/getUsersWithGroups";
import { manageUserGroup } from "@/lib/actions/manageUserGroup";
import { Button } from "@/primitives/Button";
import styles from "./page.module.css";

interface UserWithGroups {
  id: string;
  name: string;
  avatar: string | null;
  groupIds: string[];
}

export default function GroupsPage() {
  const [users, setUsers] = useState<UserWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const usersResult = await getUsersWithGroups();
        if (usersResult.data) {
          setUsers(usersResult.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const handleToggleGroup = async (userId: string, groupId: string, isCurrentlyMember: boolean) => {
    setSaving(`${userId}-${groupId}`);
    setMessage("");

    const result = await manageUserGroup({
      userId,
      groupId,
      action: isCurrentlyMember ? "remove" : "add",
    });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            groupIds: isCurrentlyMember
              ? user.groupIds.filter(id => id !== groupId)
              : [...user.groupIds, groupId],
          };
        }
        return user;
      }));
      setMessage(`Successfully ${isCurrentlyMember ? "removed from" : "added to"} group!`);
    }

    setSaving(null);
  };

  const isUserInGroup = (user: UserWithGroups, groupId: string) => {
    return user.groupIds.includes(groupId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href={DASHBOARD_HOME_URL} className={styles.backLink}>
            &larr; Back to Dashboard
          </Link>
          <h1 className={styles.title}>Admin: Manage Board Member Groups</h1>
          <p className={styles.subtitle}>
            Assign board members to document groups. Members will see group links in their sidebar.
          </p>
        </div>
        <div className={styles.tabs}>
          <Link href={ADMIN_STATISTICS_URL} className={styles.tab}>
            Statistics
          </Link>
          <Link href={ADMIN_FINANCIALS_URL} className={styles.tab}>
            Financials
          </Link>
          <Link href={ADMIN_CHECKLISTS_URL} className={styles.tab}>
            Checklists
          </Link>
        </div>
      </div>

      {message && (
        <p className={message.startsWith("Error") ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}

      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.groupsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.userColumn}>Board Member</div>
              {DOCUMENT_GROUPS.map(group => (
                <div key={group.id} className={styles.groupColumn}>
                  {group.name}
                </div>
              ))}
            </div>

            {users.filter(u => u.id && u.id !== "tbd").map(user => (
              <div key={user.id} className={styles.tableRow}>
                <div className={styles.userColumn}>
                  <div className={styles.userInfo}>
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.avatar}
                      />
                    )}
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.id}</div>
                    </div>
                  </div>
                </div>
                {DOCUMENT_GROUPS.map(group => {
                  const isMember = isUserInGroup(user, group.id);
                  const isSaving = saving === `${user.id}-${group.id}`;
                  return (
                    <div key={group.id} className={styles.groupColumn}>
                      <Button
                        variant={isMember ? "primary" : "secondary"}
                        onClick={() => handleToggleGroup(user.id, group.id, isMember)}
                        disabled={isSaving}
                        className={styles.toggleButton}
                      >
                        {isSaving ? "..." : isMember ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div className={styles.note}>
          <strong>How it works:</strong>
          <ul>
            <li>Click &quot;Add&quot; to give a board member access to a document group</li>
            <li>Click &quot;Remove&quot; to revoke access</li>
            <li>Members will see the group link in their sidebar when they log in</li>
            <li>Changes are saved to the database immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
