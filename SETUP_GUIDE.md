# Xogos Board Database - Setup Guide

**Last Updated:** December 29, 2025
**Status:** Production Ready
**Platform:** AWS RDS PostgreSQL + Next.js 14

---

## 🎯 What This Does

The Xogos Board database system stores and tracks:
- **Statistics** - Accounts, active users, total hours (with history)
- **Financials** - Revenue, expenses, payments, members (with history)
- **Checklists** - Board member tasks

**Key Feature:** Every time you update statistics or financials, it creates a **NEW record with timestamp**, so you can see how your numbers change over time and create trend graphs!

---

## ✅ Prerequisites

Before you start, make sure you have:

1. **AWS RDS PostgreSQL Database**
   - Running PostgreSQL 12 or higher
   - Publicly accessible (or accessible from your network)
   - Database name, endpoint, username, and password

2. **Environment Access**
   - Access to your `.env.local` file (local development)
   - Access to AWS Amplify environment variables (production)

3. **Admin Email**
   - Your email must be in the admin list: `lib/auth/admin.ts`
   - Default admins: enjoyweaver@gmail.com, zack@xogosgaming.com

---

## 📋 Step-by-Step Setup

### Step 1: Configure Environment Variables

**For Local Development** (`.env.local` file):

```bash
# AWS RDS PostgreSQL Database
DATABASE_HOST=your-database-endpoint.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=xogos_board
DATABASE_USER=postgres
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=true

# Existing environment variables (keep these)
LIVEBLOCKS_SECRET_KEY=sk_prod_...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

**For AWS Amplify Production:**

1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add the same DATABASE_* variables:
   - `DATABASE_HOST`
   - `DATABASE_PORT` (5432)
   - `DATABASE_NAME`
   - `DATABASE_USER`
   - `DATABASE_PASSWORD`
   - `DATABASE_SSL` (true)

### Step 2: Initialize the Database

**Option A: Using psql Command Line**

```bash
# Connect to your database
psql -h your-database-endpoint.rds.amazonaws.com -U postgres -d xogos_board

# Run the schema file
\i database/schema.sql

# Verify tables were created
\dt

# You should see:
# - board_member_profiles
# - checklist_items
# - xogos_statistics
# - xogos_financials
```

**Option B: Using a GUI Tool (pgAdmin, DBeaver, etc.)**

1. Connect to your AWS RDS database
2. Open the SQL editor
3. Copy the contents of `database/schema.sql`
4. Execute the script
5. Verify 4 tables were created

### Step 3: Test the Connection

**Start your development server:**

```bash
npm run dev
```

**Check the console output:**

You should see:
```
✅ Database connected successfully
```

If you see errors, check:
- Environment variables are correct
- AWS RDS security group allows your IP
- Database is running and accessible

### Step 4: Test the Admin Interface

1. **Sign in to your application**
   - Go to http://localhost:3000/signin
   - Sign in with your admin email

2. **Navigate to admin pages**
   - Statistics: http://localhost:3000/admin/statistics
   - Financials: http://localhost:3000/admin/financials

3. **Update some data**
   - Enter test values (e.g., accounts=100, activeUsers=25)
   - Click "Save Statistics"
   - You should see: "Statistics updated successfully!"

4. **View the trend history**
   - Scroll down on the admin page
   - You'll see a table with your historical updates
   - Each update includes timestamp and who made it

5. **Check the board room**
   - Go to http://localhost:3000/board
   - Look at the ticker at the top
   - You should see your live stats scrolling!

---

## 🚀 Usage Guide

### How to Update Statistics

1. Navigate to `/admin/statistics`
2. Update the values:
   - **Accounts** - Total number of user accounts
   - **Active Users** - Users active in last 30 days
   - **Total Hours** - Cumulative hours on platform
3. Click "Save Statistics"
4. A new record is created in the database with current timestamp
5. Changes appear on the board room ticker within 30 seconds

### How to Update Financials

1. Navigate to `/admin/financials`
2. Update the values:
   - **Revenue** - Total revenue (in dollars)
   - **Expenses** - Total expenses
   - **Monthly Payments** - Monthly subscription revenue
   - **Yearly Payments** - Annual subscription revenue
   - **Lifetime Members** - Count of lifetime members
3. Click "Save Financials"
4. A new record is created with timestamp
5. Changes appear on the board room ticker

### How Historical Tracking Works

Every time you save statistics or financials:
1. The system creates a **NEW row** in the database
2. The row includes the current timestamp and your email
3. Old records are **NEVER deleted**
4. You can query historical data for trends and graphs

**Example:**

```
Day 1: Save accounts=100, activeUsers=25
Day 2: Save accounts=150, activeUsers=40
Day 3: Save accounts=200, activeUsers=60
```

Database now has **3 records** showing growth over time!

---

## 📊 Viewing Historical Data

### In the Admin Interface

After updating stats/financials, scroll down to see:
- **Statistics History** - Table showing last 10 updates
- **Financials History** - Table showing last 10 financial snapshots

Each row shows:
- Date & Time of update
- All values at that point in time
- Who made the update

### In the Board Room

The ticker at `/board` shows **real-time data** from the database:
- Total Accounts
- Active Users
- Total Hours
- Revenue
- Expenses

Updates automatically every 30 seconds!

---

## 🔧 Troubleshooting

### Error: "connect ECONNREFUSED"

**Problem:** Can't connect to database

**Solutions:**
1. Check DATABASE_HOST is correct RDS endpoint
2. Verify AWS RDS security group allows your IP
3. Check database is running (AWS RDS Console)
4. Confirm DATABASE_PORT is 5432

### Error: "relation does not exist"

**Problem:** Tables not created

**Solutions:**
1. Run the schema file: `psql < database/schema.sql`
2. Verify you're connected to the correct database
3. Check for errors when running schema script

### Error: "Admin access required"

**Problem:** Your email is not in admin list

**Solutions:**
1. Check you're signed in with correct email
2. Add your email to `lib/auth/admin.ts` in ADMIN_EMAILS array
3. Rebuild and restart: `npm run build && npm run dev`

### Board Ticker Shows Zeros

**Problem:** No data in database yet

**Solutions:**
1. Go to `/admin/statistics` and save some data
2. Go to `/admin/financials` and save some data
3. Check browser console for errors
4. Verify database connection is working

### Historical Data Not Showing

**Problem:** TrendsDisplay component shows "No data"

**Solutions:**
1. Make sure you've saved at least one update
2. Check browser console for errors
3. Verify environment variables are set
4. Try refreshing the page

---

## 🔐 Security Notes

### Admin Access

Only emails in `lib/auth/admin.ts` can:
- Update statistics
- Update financials
- View admin pages

**To add a new admin:**

1. Edit `lib/auth/admin.ts`
2. Add email to ADMIN_EMAILS array
3. Rebuild: `npm run build`

### Database Security

- Use strong passwords for DATABASE_PASSWORD
- Enable SSL (DATABASE_SSL=true) for production
- Restrict AWS RDS security group to specific IPs
- Consider using AWS IAM authentication for enhanced security

### Environment Variables

- Never commit `.env.local` to git
- Store production credentials in AWS Secrets Manager (recommended)
- Use environment-specific values (local vs production)

---

## 📈 Advanced Usage

### Querying Historical Data

Use the server actions in your code:

```typescript
import { getStatisticsHistory } from "@/lib/actions";

// Get last 30 records
const history = await getStatisticsHistory({ limit: 30 });

// Get records in date range
const history = await getStatisticsHistory({
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  limit: 100
});

// Use for charts
const chartData = history.data.map(record => ({
  date: new Date(record.lastUpdated),
  accounts: record.accounts,
  activeUsers: record.activeUsers
}));
```

### Creating Custom Graphs

Use the historical data with any chart library:

**Example with Chart.js:**

```typescript
import { Line } from 'react-chartjs-2';
import { getStatisticsHistory } from "@/lib/actions";

const history = await getStatisticsHistory({ limit: 30 });

const data = {
  labels: history.data.map(r => new Date(r.lastUpdated).toLocaleDateString()),
  datasets: [{
    label: 'Active Users',
    data: history.data.map(r => r.activeUsers),
    borderColor: 'rgb(75, 192, 192)',
  }]
};

<Line data={data} />
```

---

## 📚 Additional Resources

- **Full Database Documentation:** `database/README.md`
- **Build Documentation:** `docs/BUILD.md`
- **Current State:** `docs/00-current-state/README.md`

### Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review `database/README.md` for detailed docs
3. Check AWS RDS Console for database status
4. Verify all environment variables are set correctly

---

## ✨ What's Next?

Now that your database is set up, you can:

1. **Add Historical Data**
   - Update stats/financials regularly
   - Build up historical records for trending

2. **Create Custom Reports**
   - Use the historical query actions
   - Build custom dashboards

3. **Add More Metrics**
   - Extend the schema with new metrics
   - Create new tracking tables

4. **Implement Alerts**
   - Set up notifications for milestone events
   - Track KPIs and trigger alerts

---

**Congratulations! Your Xogos Board database is ready to use! 🎉**

For questions or issues, refer to `database/README.md` or check the AWS RDS Console.
