# Xogos Board Database

**Last Updated:** 2025-12-29

This document describes the AWS RDS PostgreSQL database setup for Xogos Gaming board management features.

---

## Overview

The database stores persistent data for:
- **Board Member Profiles** - RSS feed preferences
- **Checklists** - Task items with completion tracking
- **Statistics** - Xogos platform metrics (accounts, active users, total hours)
- **Financials** - Revenue, expenses, payments, members

**Key Feature:** All statistics and financials updates are **time-stamped and stored historically**, enabling trending/graphing over time.

---

## Environment Variables

Add these to your `.env.local` file:

```bash
# AWS RDS PostgreSQL Database
DATABASE_HOST=your-rds-endpoint.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=xogos_board
DATABASE_USER=postgres
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=true
```

**Production Settings:**
- Set `DATABASE_SSL=true` for AWS RDS
- Use IAM authentication for enhanced security (optional)
- Store credentials in AWS Secrets Manager (recommended)

**Local Development:**
- Set `DATABASE_SSL=false` for local PostgreSQL
- Use `DATABASE_HOST=localhost`

---

## Database Schema

### Tables

#### 1. `board_member_profiles`
Stores board member personalization settings.

| Column | Type | Description |
|--------|------|-------------|
| user_id | TEXT (PK) | User email address |
| rss_topic | TEXT | Preferred RSS feed topic |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last profile update |

#### 2. `checklist_items`
Task checklist with completion tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| user_id | TEXT | Assigned user email |
| task | TEXT | Task description |
| completed | BOOLEAN | Completion status |
| created_at | TIMESTAMP | Creation time |
| created_by | TEXT | Creator email |

#### 3. `xogos_statistics` (Historical)
Platform statistics with temporal tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL (PK) | Auto-increment ID |
| accounts | INTEGER | Total accounts |
| active_users | INTEGER | Active users |
| total_hours | INTEGER | Total platform hours |
| last_updated | TIMESTAMP | Update timestamp |
| updated_by | TEXT | Updater email |

**Important:** Each `updateStatistics()` call creates a **new row** with the current timestamp, preserving history.

#### 4. `xogos_financials` (Historical)
Financial data with temporal tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL (PK) | Auto-increment ID |
| revenue | NUMERIC(12,2) | Total revenue |
| expenses | NUMERIC(12,2) | Total expenses |
| monthly_payments | NUMERIC(12,2) | Monthly subscription revenue |
| yearly_payments | NUMERIC(12,2) | Yearly subscription revenue |
| lifetime_members | INTEGER | Lifetime member count |
| last_updated | TIMESTAMP | Update timestamp |
| updated_by | TEXT | Updater email |

**Important:** Each `updateFinancials()` call creates a **new row** with the current timestamp, preserving history.

### Indexes

Performance indexes for historical queries:

```sql
idx_checklist_user_id ON checklist_items(user_id)
idx_checklist_created_at ON checklist_items(created_at DESC)
idx_statistics_last_updated ON xogos_statistics(last_updated DESC)
idx_financials_last_updated ON xogos_financials(last_updated DESC)
```

---

## Setup Instructions

### 1. Initialize Database

Run the schema file to create tables:

```bash
# Connect to your PostgreSQL database
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d xogos_board

# Run the schema
\i database/schema.sql
```

**Or use a database client:**
- Copy contents of `database/schema.sql`
- Execute in pgAdmin, DBeaver, or your preferred SQL client

### 2. Verify Tables

```sql
-- List all tables
\dt

-- Check table structure
\d xogos_statistics
\d xogos_financials
\d checklist_items
\d board_member_profiles
```

### 3. Test Connection

The database connection is automatically tested on application startup. Check your Next.js console for:

```
✅ Database connected successfully
```

If you see connection errors:
- Verify environment variables are set correctly
- Check AWS RDS security group allows your IP
- Confirm database credentials are valid
- Ensure RDS instance is running

---

## Server Actions API

All database operations are exposed through server actions in `lib/actions/`.

### Statistics

#### Get Current Statistics
```typescript
import { getStatistics } from "@/lib/actions";

const result = await getStatistics();
if (result.data) {
  console.log(result.data.accounts); // Current account count
}
```

#### Get Historical Statistics
```typescript
import { getStatisticsHistory } from "@/lib/actions";

// Get last 30 records
const result = await getStatisticsHistory({ limit: 30 });

// Get records in date range
const result = await getStatisticsHistory({
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  limit: 100
});
```

#### Update Statistics (Admin Only)
```typescript
import { updateStatistics } from "@/lib/actions";

const result = await updateStatistics({
  accounts: 1500,
  activeUsers: 450,
  totalHours: 12000
});
```

**Note:** Creates a new historical record with current timestamp.

### Financials

#### Get Current Financials
```typescript
import { getFinancials } from "@/lib/actions";

const result = await getFinancials();
if (result.data) {
  console.log(result.data.revenue); // Current revenue
}
```

#### Get Historical Financials
```typescript
import { getFinancialsHistory } from "@/lib/actions";

// Get last 30 records
const result = await getFinancialsHistory({ limit: 30 });
```

#### Update Financials (Admin Only)
```typescript
import { updateFinancials } from "@/lib/actions";

const result = await updateFinancials({
  revenue: 50000,
  expenses: 25000,
  monthlyPayments: 10000,
  yearlyPayments: 30000,
  lifetimeMembers: 50
});
```

**Note:** Creates a new historical record with current timestamp.

### Checklists

#### Get User Checklists
```typescript
import { getChecklists } from "@/lib/actions";

const result = await getChecklists();
```

#### Get All Checklists (Admin)
```typescript
import { getAllChecklists } from "@/lib/actions";

const result = await getAllChecklists();
```

#### Get Checklist History
```typescript
import { getChecklistHistory } from "@/lib/actions";

const result = await getChecklistHistory({
  userId: "user@example.com",
  startDate: "2025-01-01",
  limit: 50
});
```

#### Create Checklist Item
```typescript
import { createChecklistItem } from "@/lib/actions";

const result = await createChecklistItem({
  task: "Review Q4 financials",
  userId: "user@example.com"
});
```

#### Update Checklist Item
```typescript
import { updateChecklistItem } from "@/lib/actions";

const result = await updateChecklistItem({
  id: "uuid-here",
  completed: true
});
```

---

## Historical Data & Trending

### How Historical Tracking Works

1. **Statistics & Financials:**
   - Each update creates a **new row** in the database
   - Old records are **never modified or deleted**
   - Each row has a `last_updated` timestamp

2. **Querying Historical Data:**
   ```typescript
   // Get trends over time
   const history = await getStatisticsHistory({ limit: 30 });

   // Data structure
   history.data.forEach(record => {
     console.log(record.lastUpdated); // ISO timestamp
     console.log(record.accounts);     // Value at that time
     console.log(record.updatedBy);    // Who made the update
   });
   ```

3. **Graphing/Charting:**
   - Use historical data to show trends
   - Plot `lastUpdated` (x-axis) vs metric values (y-axis)
   - Example: Revenue growth over last 90 days

### Example: Revenue Trend Graph

```typescript
import { getFinancialsHistory } from "@/lib/actions";

// Get last 90 days of data
const result = await getFinancialsHistory({
  startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  limit: 1000
});

if (result.data) {
  const chartData = result.data.map(record => ({
    date: new Date(record.lastUpdated),
    revenue: record.revenue,
    expenses: record.expenses
  }));

  // Use with any chart library (Chart.js, Recharts, etc.)
}
```

---

## Security

### Row Level Security (RLS)

Tables have RLS enabled with permissive policies for now:

```sql
CREATE POLICY "Allow all for authenticated users" ON xogos_statistics FOR ALL USING (true);
```

**Production Recommendations:**
1. Restrict `xogos_statistics` and `xogos_financials` updates to admin users
2. Restrict `checklist_items` to assigned users
3. Use session variables for user identification

### Admin Access

Server actions check for admin permissions:

```typescript
import { isAdmin } from "@/lib/auth/admin";

// Only these emails have admin access
const ADMIN_EMAILS = [
  "enjoyweaver@gmail.com",
  "zack@xogosgaming.com",
  // ... other admins
];
```

---

## Monitoring & Maintenance

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('xogos_board'));
```

### Monitor Historical Data Growth

```sql
-- Check number of historical records
SELECT
  (SELECT COUNT(*) FROM xogos_statistics) as stats_count,
  (SELECT COUNT(*) FROM xogos_financials) as financials_count,
  (SELECT COUNT(*) FROM checklist_items) as checklist_count;
```

### Backup Recommendations

- **AWS RDS Automated Backups:** Enable with 7-30 day retention
- **Point-in-Time Recovery:** Configure backup window
- **Manual Snapshots:** Create before major updates
- **Export Historical Data:** Periodically export to S3 for long-term storage

---

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Solutions:**
1. Check AWS RDS security group inbound rules
2. Verify database is running
3. Confirm environment variables are correct
4. Check VPN/network access to AWS

### SSL/TLS Errors

```
Error: self signed certificate
```

**Solution:**
```bash
# In .env.local
DATABASE_SSL=true  # For AWS RDS
```

### Missing Tables

```
Error: relation "xogos_statistics" does not exist
```

**Solution:**
Run the schema file: `psql < database/schema.sql`

### Permission Denied

```
Error: permission denied for table xogos_statistics
```

**Solution:**
- Grant permissions: `GRANT ALL ON ALL TABLES IN SCHEMA public TO your_user;`
- Or create tables with your database user

---

## Migration Notes

### From Supabase to AWS RDS (December 2025)

The project was migrated from Supabase to AWS RDS PostgreSQL. If you have existing Supabase data:

1. **Export from Supabase:**
   ```sql
   pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
   ```

2. **Import to AWS RDS:**
   ```sql
   psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d xogos_board < backup.sql
   ```

---

## Future Enhancements

Planned improvements:
- [ ] Automated data archival for old records
- [ ] Aggregated views for faster analytics
- [ ] Data export API endpoints
- [ ] GraphQL API for complex queries
- [ ] Real-time subscriptions for live updates
- [ ] Data visualization dashboard components

---

## Related Documentation

- [BUILD.md](../docs/BUILD.md) - Build process
- [Section 00: Current State](../docs/00-current-state/README.md) - Project status
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Questions or issues? Contact the CTO or check the troubleshooting section above.**
