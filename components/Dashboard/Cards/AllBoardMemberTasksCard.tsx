"use client";

import { useEffect, useState } from "react";
import { getAllChecklists } from "@/lib/actions/getAllChecklists";
import { users } from "@/data/users";
import styles from "./AllBoardMemberTasksCard.module.css";

interface ChecklistItem {
  id: string;
  userId: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  createdBy: string;
}

export function AllBoardMemberTasksCard() {
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadAllTasks();
  }, []);

  async function loadAllTasks() {
    setLoading(true);
    setError("");

    const result = await getAllChecklists();

    if (result.error) {
      setError(result.error.message);
    } else if (result.data) {
      setTasks(result.data);
    }

    setLoading(false);
  }

  function getUserName(userId: string): string {
    const user = users.find((u) => u.id === userId);
    return user?.name || userId;
  }

  function groupTasksByUser() {
    const grouped: { [userId: string]: ChecklistItem[] } = {};

    tasks.forEach((task) => {
      if (!grouped[task.userId]) {
        grouped[task.userId] = [];
      }
      grouped[task.userId].push(task);
    });

    return grouped;
  }

  const groupedTasks = groupTasksByUser();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Board Member Tasks</h2>
        <div className={styles.stats}>
          <span className={styles.statBadge}>
            {completedTasks}/{totalTasks} completed ({completionRate}%)
          </span>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading tasks...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : totalTasks === 0 ? (
          <div className={styles.emptyState}>
            <p>No tasks assigned yet.</p>
          </div>
        ) : (
          <div className={styles.tasksList}>
            {Object.entries(groupedTasks).map(([userId, userTasks]) => (
              <div key={userId} className={styles.userGroup}>
                <h3 className={styles.userName}>
                  {getUserName(userId)}
                  <span className={styles.userTaskCount}>
                    ({userTasks.filter(t => t.completed).length}/{userTasks.length})
                  </span>
                </h3>
                <ul className={styles.tasks}>
                  {userTasks.map((task) => (
                    <li key={task.id} className={styles.taskItem}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className={styles.checkbox}
                      />
                      <span className={task.completed ? styles.taskCompleted : styles.taskText}>
                        {task.task}
                      </span>
                      {task.completed && (
                        <span className={styles.completedBadge}>✓</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
