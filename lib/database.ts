import { Pool, QueryResult } from "pg";

// AWS RDS PostgreSQL connection configuration
// These will be set in your environment variables
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl:
    process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
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
  async createChecklistItem(userId: string, task: string, createdBy: string) {
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
  async addRssSubscription(
    userId: string,
    topic: string,
    displayName?: string
  ) {
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
      [
        revenue,
        expenses,
        monthlyPayments,
        yearlyPayments,
        lifetimeMembers,
        updatedBy,
      ]
    );
    return result.rows[0];
  },

  // ============ PAGE VISITS FUNCTIONS ============

  /**
   * Log a page visit
   */
  async logPageVisit(
    pagePath: string,
    pageName?: string,
    visitorId?: string,
    userAgent?: string,
    referrer?: string
  ) {
    const result = await query(
      `INSERT INTO page_visits (page_path, page_name, visitor_id, user_agent, referrer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, page_path, created_at`,
      [pagePath, pageName, visitorId, userAgent, referrer]
    );
    return result.rows[0];
  },

  /**
   * Get page visit statistics
   */
  async getPageVisitStats(days: number = 30) {
    const result = await query(
      `SELECT
         page_path,
         page_name,
         COUNT(*) as visit_count,
         COUNT(DISTINCT visitor_id) as unique_visitors
       FROM page_visits
       WHERE created_at >= NOW() - INTERVAL '1 day' * $1
       GROUP BY page_path, page_name
       ORDER BY visit_count DESC`,
      [days]
    );
    return result.rows;
  },

  /**
   * Get total site visits
   */
  async getTotalVisits(days: number = 30) {
    const result = await query(
      `SELECT
         COUNT(*) as total_visits,
         COUNT(DISTINCT visitor_id) as unique_visitors
       FROM page_visits
       WHERE created_at >= NOW() - INTERVAL '1 day' * $1`,
      [days]
    );
    return result.rows[0];
  },

  /**
   * Get visits for a specific page
   */
  async getPageVisits(pagePath: string, days: number = 30) {
    const result = await query(
      `SELECT
         COUNT(*) as visit_count,
         COUNT(DISTINCT visitor_id) as unique_visitors
       FROM page_visits
       WHERE page_path = $1 AND created_at >= NOW() - INTERVAL '1 day' * $2`,
      [pagePath, days]
    );
    return result.rows[0];
  },

  // ============ GROUP FUNCTIONS ============

  /**
   * Get a group by ID
   */
  async getGroupById(groupId: string) {
    const result = await query(
      `SELECT id, name, created_at
       FROM groups
       WHERE id = $1`,
      [groupId]
    );
    return result.rows[0];
  },

  /**
   * Get all groups
   */
  async getAllGroups() {
    const result = await query(
      `SELECT id, name, created_at
       FROM groups
       ORDER BY name`
    );
    return result.rows;
  },

  /**
   * Get multiple groups by their IDs
   */
  async getGroupsByIds(groupIds: string[]) {
    if (groupIds.length === 0) return [];
    const result = await query(
      `SELECT id, name, created_at
       FROM groups
       WHERE id = ANY($1)
       ORDER BY name`,
      [groupIds]
    );
    return result.rows;
  },

  /**
   * Create a new group
   */
  async createGroup(id: string, name: string) {
    const result = await query(
      `INSERT INTO groups (id, name)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET name = $2
       RETURNING id, name, created_at`,
      [id, name]
    );
    return result.rows[0];
  },

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string) {
    await query(`DELETE FROM groups WHERE id = $1`, [groupId]);
  },

  /**
   * Get all groups for a user
   */
  async getGroupsForUser(userId: string) {
    const result = await query(
      `SELECT g.id, g.name, g.created_at
       FROM groups g
       INNER JOIN user_groups ug ON g.id = ug.group_id
       WHERE ug.user_id = $1
       ORDER BY g.name`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get all users in a group
   */
  async getUsersInGroup(groupId: string) {
    const result = await query(
      `SELECT u.id, u.name, u.avatar, u.is_active, u.created_at, u.updated_at
       FROM users u
       INNER JOIN user_groups ug ON u.id = ug.user_id
       WHERE ug.group_id = $1
       ORDER BY u.name`,
      [groupId]
    );
    return result.rows;
  },

  // ============ USER FUNCTIONS ============

  /**
   * Get a user by ID (email)
   */
  async getUserById(userId: string) {
    const result = await query(
      `SELECT u.id, u.name, u.avatar, u.is_active, u.created_at, u.updated_at,
              COALESCE(
                json_agg(ug.group_id) FILTER (WHERE ug.group_id IS NOT NULL),
                '[]'
              ) as group_ids
       FROM users u
       LEFT JOIN user_groups ug ON u.id = ug.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );
    return result.rows[0];
  },

  /**
   * Get all users
   */
  async getAllUsers() {
    const result = await query(
      `SELECT u.id, u.name, u.avatar, u.is_active, u.created_at, u.updated_at,
              COALESCE(
                json_agg(ug.group_id) FILTER (WHERE ug.group_id IS NOT NULL),
                '[]'
              ) as group_ids
       FROM users u
       LEFT JOIN user_groups ug ON u.id = ug.user_id
       GROUP BY u.id
       ORDER BY u.name`
    );
    return result.rows;
  },

  /**
   * Create or update a user
   */
  async upsertUser(userId: string, name: string, avatar?: string) {
    const result = await query(
      `INSERT INTO users (id, name, avatar, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (id)
       DO UPDATE SET name = $2, avatar = COALESCE($3, users.avatar), updated_at = NOW()
       RETURNING id, name, avatar, is_active, created_at, updated_at`,
      [userId, name, avatar]
    );
    return result.rows[0];
  },

  /**
   * Add user to a group
   */
  async addUserToGroup(userId: string, groupId: string) {
    await query(
      `INSERT INTO user_groups (user_id, group_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, group_id) DO NOTHING`,
      [userId, groupId]
    );
  },

  /**
   * Remove user from a group
   */
  async removeUserFromGroup(userId: string, groupId: string) {
    await query(
      `DELETE FROM user_groups WHERE user_id = $1 AND group_id = $2`,
      [userId, groupId]
    );
  },

  // ============ NEWSLETTER FUNCTIONS ============

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string, name?: string, source?: string) {
    const result = await query(
      `INSERT INTO newsletter_subscriptions (email, name, source)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET
         name = COALESCE($2, newsletter_subscriptions.name),
         is_active = true,
         unsubscribed_at = NULL
       RETURNING id, email, name, source, subscribed_at, is_active`,
      [email.toLowerCase(), name, source || "website"]
    );
    return result.rows[0];
  },

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribeFromNewsletter(email: string) {
    const result = await query(
      `UPDATE newsletter_subscriptions
       SET is_active = false, unsubscribed_at = NOW()
       WHERE email = $1
       RETURNING id, email, is_active`,
      [email.toLowerCase()]
    );
    return result.rows[0];
  },

  /**
   * Get all newsletter subscriptions (admin)
   */
  async getNewsletterSubscriptions(activeOnly: boolean = true) {
    const whereClause = activeOnly ? "WHERE is_active = true" : "";
    const result = await query(
      `SELECT id, email, name, source, subscribed_at, unsubscribed_at, is_active
       FROM newsletter_subscriptions
       ${whereClause}
       ORDER BY subscribed_at DESC`
    );
    return result.rows;
  },

  /**
   * Get newsletter subscription count
   */
  async getNewsletterCount() {
    const result = await query(
      `SELECT
         COUNT(*) FILTER (WHERE is_active = true) as active_count,
         COUNT(*) as total_count
       FROM newsletter_subscriptions`
    );
    return result.rows[0];
  },

  // ============ ERROR LOG FUNCTIONS ============

  /**
   * Log an error
   */
  async logError(
    errorType: string,
    errorMessage: string,
    errorStack?: string,
    userId?: string,
    url?: string,
    userAgent?: string,
    metadata?: object
  ) {
    const result = await query(
      `INSERT INTO error_logs (error_type, error_message, error_stack, user_id, url, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, error_type, error_message, created_at`,
      [
        errorType,
        errorMessage,
        errorStack,
        userId,
        url,
        userAgent,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );
    return result.rows[0];
  },

  /**
   * Get error logs (admin)
   */
  async getErrorLogs(limit: number = 50, errorType?: string) {
    let queryText = `SELECT id, error_type, error_message, error_stack, user_id, url, user_agent, metadata, created_at
                     FROM error_logs`;
    const params: any[] = [];

    if (errorType) {
      queryText += ` WHERE error_type = $1`;
      params.push(errorType);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(queryText, params);
    return result.rows;
  },

  /**
   * Get error log statistics
   */
  async getErrorStats(days: number = 7) {
    const result = await query(
      `SELECT
         error_type,
         COUNT(*) as count,
         MAX(created_at) as last_occurrence
       FROM error_logs
       WHERE created_at >= NOW() - INTERVAL '1 day' * $1
       GROUP BY error_type
       ORDER BY count DESC`,
      [days]
    );
    return result.rows;
  },

  /**
   * Clear old error logs
   */
  async clearOldErrorLogs(daysOld: number = 30) {
    const result = await query(
      `DELETE FROM error_logs
       WHERE created_at < NOW() - INTERVAL '1 day' * $1
       RETURNING id`,
      [daysOld]
    );
    return result.rowCount;
  },

  // ============ STRIPE FUNCTIONS ============

  /**
   * Log a Stripe webhook event
   */
  async logStripeEvent(eventId: string, eventType: string, eventData: string) {
    const result = await query(
      `INSERT INTO stripe_events (stripe_event_id, event_type, event_data)
       VALUES ($1, $2, $3)
       ON CONFLICT (stripe_event_id) DO NOTHING
       RETURNING id, stripe_event_id, event_type, created_at`,
      [eventId, eventType, eventData]
    );
    return result.rows[0];
  },

  /**
   * Upsert a Stripe customer
   */
  async upsertStripeCustomer(data: {
    stripeCustomerId: string;
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }) {
    const result = await query(
      `INSERT INTO stripe_customers (stripe_customer_id, email, name, metadata)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (stripe_customer_id)
       DO UPDATE SET
         email = COALESCE($2, stripe_customers.email),
         name = COALESCE($3, stripe_customers.name),
         metadata = COALESCE($4, stripe_customers.metadata),
         updated_at = NOW()
       RETURNING id, stripe_customer_id, email, name, created_at`,
      [
        data.stripeCustomerId,
        data.email,
        data.name,
        data.metadata ? JSON.stringify(data.metadata) : null,
      ]
    );
    return result.rows[0];
  },

  /**
   * Delete a Stripe customer
   */
  async deleteStripeCustomer(stripeCustomerId: string) {
    await query(
      `DELETE FROM stripe_customers WHERE stripe_customer_id = $1`,
      [stripeCustomerId]
    );
  },

  /**
   * Upsert a Stripe subscription
   */
  async upsertStripeSubscription(data: {
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    stripePriceId: string;
    subscriptionType: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    canceledAt: Date | null;
  }) {
    const result = await query(
      `INSERT INTO stripe_subscriptions (
         stripe_subscription_id, stripe_customer_id, stripe_price_id,
         subscription_type, status, current_period_start, current_period_end, canceled_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (stripe_subscription_id)
       DO UPDATE SET
         stripe_customer_id = $2,
         stripe_price_id = $3,
         subscription_type = $4,
         status = $5,
         current_period_start = $6,
         current_period_end = $7,
         canceled_at = $8,
         updated_at = NOW()
       RETURNING *`,
      [
        data.stripeSubscriptionId,
        data.stripeCustomerId,
        data.stripePriceId,
        data.subscriptionType,
        data.status,
        data.currentPeriodStart,
        data.currentPeriodEnd,
        data.canceledAt,
      ]
    );
    return result.rows[0];
  },

  /**
   * Update subscription status
   */
  async updateStripeSubscriptionStatus(
    stripeSubscriptionId: string,
    status: string
  ) {
    const result = await query(
      `UPDATE stripe_subscriptions
       SET status = $2, updated_at = NOW(), canceled_at = CASE WHEN $2 = 'canceled' THEN NOW() ELSE canceled_at END
       WHERE stripe_subscription_id = $1
       RETURNING *`,
      [stripeSubscriptionId, status]
    );
    return result.rows[0];
  },

  /**
   * Record a Stripe payment
   */
  async recordStripePayment(data: {
    stripeCustomerId: string;
    stripeInvoiceId: string;
    amount: number;
    currency: string;
    paidAt: Date;
  }) {
    const result = await query(
      `INSERT INTO stripe_payments (stripe_customer_id, stripe_invoice_id, amount, currency, paid_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (stripe_invoice_id) DO NOTHING
       RETURNING *`,
      [
        data.stripeCustomerId,
        data.stripeInvoiceId,
        data.amount,
        data.currency,
        data.paidAt,
      ]
    );
    return result.rows[0];
  },

  /**
   * Get membership metrics for financial dashboard
   */
  async getMembershipMetrics() {
    // Total active members by type
    const activeMembers = await query(
      `SELECT
         subscription_type,
         COUNT(*) as count
       FROM stripe_subscriptions
       WHERE status = 'active'
       GROUP BY subscription_type`
    );

    // New members this month
    const newMembersThisMonth = await query(
      `SELECT COUNT(*) as count
       FROM stripe_subscriptions
       WHERE created_at >= date_trunc('month', CURRENT_DATE)
       AND status = 'active'`
    );

    // Members lost this month (canceled)
    const membersLostThisMonth = await query(
      `SELECT COUNT(*) as count
       FROM stripe_subscriptions
       WHERE canceled_at >= date_trunc('month', CURRENT_DATE)`
    );

    // Revenue this month
    const revenueThisMonth = await query(
      `SELECT
         COALESCE(SUM(amount), 0) as total,
         currency
       FROM stripe_payments
       WHERE paid_at >= date_trunc('month', CURRENT_DATE)
       GROUP BY currency`
    );

    // Calculate churn rate
    const totalActiveAtStartOfMonth = await query(
      `SELECT COUNT(*) as count
       FROM stripe_subscriptions
       WHERE created_at < date_trunc('month', CURRENT_DATE)
       AND (canceled_at IS NULL OR canceled_at >= date_trunc('month', CURRENT_DATE))`
    );

    const startCount = parseInt(totalActiveAtStartOfMonth.rows[0]?.count || "0");
    const lostCount = parseInt(membersLostThisMonth.rows[0]?.count || "0");
    const churnRate = startCount > 0 ? ((lostCount / startCount) * 100).toFixed(2) : "0.00";

    // Monthly revenue trend (last 6 months)
    const revenueTrend = await query(
      `SELECT
         date_trunc('month', paid_at) as month,
         COALESCE(SUM(amount), 0) as total
       FROM stripe_payments
       WHERE paid_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'
       GROUP BY date_trunc('month', paid_at)
       ORDER BY month ASC`
    );

    // Build response
    const membersByType: Record<string, number> = {};
    activeMembers.rows.forEach((row: { subscription_type: string; count: string }) => {
      membersByType[row.subscription_type] = parseInt(row.count);
    });

    return {
      totalMembers: Object.values(membersByType).reduce((a, b) => a + b, 0),
      membersByType,
      newMembersThisMonth: parseInt(newMembersThisMonth.rows[0]?.count || "0"),
      membersLostThisMonth: parseInt(membersLostThisMonth.rows[0]?.count || "0"),
      revenueThisMonth: revenueThisMonth.rows[0]?.total
        ? parseFloat(revenueThisMonth.rows[0].total)
        : 0,
      currency: revenueThisMonth.rows[0]?.currency || "usd",
      churnRate: parseFloat(churnRate),
      revenueTrend: revenueTrend.rows.map((row: { month: string; total: string }) => ({
        month: row.month,
        total: parseFloat(row.total),
      })),
    };
  },

  /**
   * Get all Stripe customers with their subscriptions
   */
  async getStripeCustomersWithSubscriptions(limit: number = 100) {
    const result = await query(
      `SELECT
         c.id, c.stripe_customer_id, c.email, c.name, c.created_at,
         s.stripe_subscription_id, s.subscription_type, s.status,
         s.current_period_start, s.current_period_end
       FROM stripe_customers c
       LEFT JOIN stripe_subscriptions s ON c.stripe_customer_id = s.stripe_customer_id
       ORDER BY c.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  /**
   * Get recent Stripe events
   */
  async getRecentStripeEvents(limit: number = 50) {
    const result = await query(
      `SELECT id, stripe_event_id, event_type, created_at
       FROM stripe_events
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
};

export default pool;
