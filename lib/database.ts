import { Pool, QueryResult } from "pg";

// AWS RDS PostgreSQL connection configuration
// These will be set in your environment variables
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (!process.env.DATABASE_HOST || !process.env.DATABASE_NAME) {
  console.warn(
    "Database credentials not found. Database features will not work. Please set DATABASE_HOST, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD in environment variables."
  );
}

// Test the connection
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

/**
 * Execute a SQL query
 * @param text SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return await pool.connect();
}

// Helper functions for common operations
export const db = {
  /**
   * Get checklist items for a user
   */
  async getChecklistItems(userId: string) {
    const result = await query(
      `SELECT id, user_id, task, completed, created_at, created_by
       FROM checklist_items
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get all checklist items (admin)
   */
  async getAllChecklistItems() {
    const result = await query(
      `SELECT id, user_id, task, completed, created_at, created_by
       FROM checklist_items
       ORDER BY created_at DESC`
    );
    return result.rows;
  },

  /**
   * Get checklist history with filters
   * @param userId Optional user filter
   * @param startDate Optional start date filter
   * @param endDate Optional end date filter
   * @param limit Number of records to retrieve (default: 50)
   */
  async getChecklistHistory(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 50
  ) {
    let queryText = `SELECT id, user_id, task, completed, created_at, created_by
                     FROM checklist_items
                     WHERE 1=1`;
    const params: any[] = [];
    let paramCount = 1;

    if (userId) {
      queryText += ` AND user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    if (startDate) {
      queryText += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      queryText += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await query(queryText, params);
    return result.rows;
  },

  /**
   * Create a checklist item
   */
  async createChecklistItem(
    userId: string,
    task: string,
    createdBy: string
  ) {
    const result = await query(
      `INSERT INTO checklist_items (user_id, task, completed, created_by)
       VALUES ($1, $2, false, $3)
       RETURNING id, user_id, task, completed, created_at, created_by`,
      [userId, task, createdBy]
    );
    return result.rows[0];
  },

  /**
   * Update checklist item completion status
   */
  async updateChecklistItem(id: string, completed: boolean) {
    const result = await query(
      `UPDATE checklist_items
       SET completed = $2
       WHERE id = $1
       RETURNING id, user_id, task, completed, created_at, created_by`,
      [id, completed]
    );
    return result.rows[0];
  },

  /**
   * Delete a checklist item
   */
  async deleteChecklistItem(id: string) {
    await query(`DELETE FROM checklist_items WHERE id = $1`, [id]);
  },

  /**
   * Get a single checklist item
   */
  async getChecklistItem(id: string) {
    const result = await query(
      `SELECT id, user_id, task, completed, created_at, created_by
       FROM checklist_items
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Get board member profile
   */
  async getProfile(userId: string) {
    const result = await query(
      `SELECT user_id, rss_topic, created_at, updated_at
       FROM board_member_profiles
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  /**
   * Update RSS topic
   */
  async updateRssTopic(userId: string, rssTopic: string) {
    const result = await query(
      `INSERT INTO board_member_profiles (user_id, rss_topic, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET rss_topic = $2, updated_at = NOW()
       RETURNING user_id, rss_topic, created_at, updated_at`,
      [userId, rssTopic]
    );
    return result.rows[0];
  },

  /**
   * Get all RSS subscriptions for a user
   */
  async getRssSubscriptions(userId: string) {
    const result = await query(
      `SELECT id, user_id, topic, display_name, created_at
       FROM rss_subscriptions
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Add a new RSS subscription
   */
  async addRssSubscription(userId: string, topic: string, displayName?: string) {
    const result = await query(
      `INSERT INTO rss_subscriptions (user_id, topic, display_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, topic) DO UPDATE
       SET display_name = $3
       RETURNING id, user_id, topic, display_name, created_at`,
      [userId, topic, displayName || topic]
    );
    return result.rows[0];
  },

  /**
   * Remove an RSS subscription
   */
  async removeRssSubscription(id: string, userId: string) {
    await query(
      `DELETE FROM rss_subscriptions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
  },

  /**
   * Get latest Xogos statistics
   */
  async getStatistics() {
    const result = await query(
      `SELECT id, accounts, active_users, total_hours, last_updated, updated_by
       FROM xogos_statistics
       ORDER BY id DESC
       LIMIT 1`
    );
    return result.rows[0];
  },

  /**
   * Get historical Xogos statistics (for trending/graphs)
   * @param limit Number of records to retrieve (default: 30)
   * @param startDate Optional start date filter
   * @param endDate Optional end date filter
   */
  async getStatisticsHistory(
    limit: number = 30,
    startDate?: Date,
    endDate?: Date
  ) {
    let queryText = `SELECT id, accounts, active_users, total_hours, last_updated, updated_by
                     FROM xogos_statistics
                     WHERE 1=1`;
    const params: any[] = [];
    let paramCount = 1;

    if (startDate) {
      queryText += ` AND last_updated >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      queryText += ` AND last_updated <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    queryText += ` ORDER BY last_updated DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await query(queryText, params);
    return result.rows;
  },

  /**
   * Update Xogos statistics
   */
  async updateStatistics(
    accounts: number,
    activeUsers: number,
    totalHours: number,
    updatedBy: string
  ) {
    const result = await query(
      `INSERT INTO xogos_statistics (accounts, active_users, total_hours, updated_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, accounts, active_users, total_hours, last_updated, updated_by`,
      [accounts, activeUsers, totalHours, updatedBy]
    );
    return result.rows[0];
  },

  /**
   * Get latest Xogos financials
   */
  async getFinancials() {
    const result = await query(
      `SELECT id, revenue, expenses, monthly_payments, yearly_payments, lifetime_members, last_updated, updated_by
       FROM xogos_financials
       ORDER BY id DESC
       LIMIT 1`
    );
    return result.rows[0];
  },

  /**
   * Get historical Xogos financials (for trending/graphs)
   * @param limit Number of records to retrieve (default: 30)
   * @param startDate Optional start date filter
   * @param endDate Optional end date filter
   */
  async getFinancialsHistory(
    limit: number = 30,
    startDate?: Date,
    endDate?: Date
  ) {
    let queryText = `SELECT id, revenue, expenses, monthly_payments, yearly_payments, lifetime_members, last_updated, updated_by
                     FROM xogos_financials
                     WHERE 1=1`;
    const params: any[] = [];
    let paramCount = 1;

    if (startDate) {
      queryText += ` AND last_updated >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      queryText += ` AND last_updated <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    queryText += ` ORDER BY last_updated DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await query(queryText, params);
    return result.rows;
  },

  /**
   * Update Xogos financials
   */
  async updateFinancials(
    revenue: number,
    expenses: number,
    monthlyPayments: number,
    yearlyPayments: number,
    lifetimeMembers: number,
    updatedBy: string
  ) {
    const result = await query(
      `INSERT INTO xogos_financials (revenue, expenses, monthly_payments, yearly_payments, lifetime_members, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, revenue, expenses, monthly_payments, yearly_payments, lifetime_members, last_updated, updated_by`,
      [revenue, expenses, monthlyPayments, yearlyPayments, lifetimeMembers, updatedBy]
    );
    return result.rows[0];
  },
};

export default pool;
