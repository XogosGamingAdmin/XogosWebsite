# AWS RDS PostgreSQL Setup - Complete Walkthrough

**Estimated Time:** 20 minutes
**Cost:** $0/month (free tier) for first year, then ~$15/month

Follow these steps **in order**. Each step has copy-paste ready commands.

---

## Part 1: Create RDS PostgreSQL Database (10 minutes)

### Step 1: Log into AWS Console

1. Go to https://console.aws.amazon.com/
2. Sign in with your AWS account
3. **Make sure you're in the correct region** (top-right corner)
   - Recommended: **us-east-1** (N. Virginia) - same as your Amplify app

---

### Step 2: Navigate to RDS

1. In the AWS Console search bar, type: **RDS**
2. Click **RDS** (Relational Database Service)
3. Click **Create database** (orange button)

---

### Step 3: Configure Database Settings

**Engine options:**
- ✅ Choose: **PostgreSQL**
- Version: **PostgreSQL 15.5** (or latest)

**Templates:**
- ✅ Choose: **Free tier** (if available)
- Or choose: **Dev/Test** (for production quality)

**Settings:**
```
DB instance identifier: xogos-board-db
Master username: postgres
Master password: [CREATE A STRONG PASSWORD - SAVE IT!]
Confirm password: [SAME PASSWORD]
```

**⚠️ CRITICAL: Save your password now!**
```
Database Password: ___________________________
(Write it here or in a password manager)
```

**Instance configuration:**
- ✅ Choose: **db.t3.micro** (free tier eligible)
- Or if free tier not available: **db.t4g.micro** (cheapest option)

**Storage:**
- Storage type: **General Purpose SSD (gp3)**
- Allocated storage: **20 GB** (minimum)
- ✅ Uncheck "Enable storage autoscaling" (unless you expect rapid growth)

**Connectivity:**
- Virtual Private Cloud (VPC): **Default VPC**
- Subnet group: **default**
- Public access: ✅ **Yes** (so your app can connect)
- VPC security group: **Create new**
  - New VPC security group name: `xogos-db-sg`

**Database authentication:**
- ✅ Check: **Password authentication**

**Additional configuration (click to expand):**
- Initial database name: **xogos_board** ⚠️ IMPORTANT - type this exactly!
- Backup retention period: **7 days** (recommended)
- ✅ Check: **Enable automated backups**
- ✅ Uncheck: **Enable encryption** (optional, adds cost)
- Monitoring: ✅ **Enable Enhanced Monitoring** (free tier eligible)

**Estimated monthly costs:**
- Should show: **$0.00** (if using free tier)
- Or: **~$12-15/month** (if free tier exhausted)

---

### Step 4: Create Database

1. Scroll to bottom
2. Click **Create database** (orange button)
3. **Wait 5-10 minutes** while AWS creates your database
   - Status will show: "Creating"
   - When ready, status changes to: "Available"

---

### Step 5: Get Database Connection Info

Once status is "Available":

1. Click on your database name: **xogos-board-db**
2. Under **Connectivity & security** tab, find:

```
Endpoint: ___________________________________.rds.amazonaws.com
Port: 5432
```

**⚠️ COPY THESE VALUES - YOU'LL NEED THEM!**

```
DATABASE_HOST: ___________________________________.rds.amazonaws.com
DATABASE_PORT: 5432
DATABASE_NAME: xogos_board
DATABASE_USER: postgres
DATABASE_PASSWORD: [the password you created in Step 3]
```

---

### Step 6: Configure Security Group (Allow Your IP)

Your database needs to allow connections from:
- Your local computer (for setup)
- AWS Amplify (for production)

**Option A: Allow All IPs (Easier, Less Secure):**

1. Still on database details page, scroll to **Security group rules**
2. Click the security group: **xogos-db-sg**
3. Click **Edit inbound rules**
4. Click **Add rule**
   - Type: **PostgreSQL**
   - Protocol: **TCP**
   - Port: **5432**
   - Source: **Anywhere-IPv4** (0.0.0.0/0)
   - Description: `Xogos database access`
5. Click **Save rules**

**Option B: Allow Specific IPs (More Secure):**

1. Get your current IP: https://whatismyipaddress.com/
2. In security group, add rule:
   - Type: **PostgreSQL**
   - Source: **My IP** (or paste your IP)
   - Description: `My local machine`
3. Add another rule:
   - Type: **PostgreSQL**
   - Source: **Custom** → `0.0.0.0/0`
   - Description: `AWS Amplify` (we'll restrict this later)
4. Click **Save rules**

---

## Part 2: Initialize Database Schema (5 minutes)

Now let's create the tables in your new database.

### Step 7: Test Connection from Your Computer

**Option A: Using psql (Command Line):**

**Install psql if you don't have it:**

Windows:
```bash
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

Mac:
```bash
brew install postgresql
```

Linux:
```bash
sudo apt-get install postgresql-client
```

**Test connection:**

```bash
psql -h YOUR_ENDPOINT.rds.amazonaws.com -U postgres -d xogos_board
# When prompted, enter your password

# If successful, you'll see:
# xogos_board=>

# Type to exit:
\q
```

**Option B: Using a GUI Tool (Easier):**

**Download pgAdmin:** https://www.pgadmin.org/download/

1. Open pgAdmin
2. Right-click **Servers** → **Create** → **Server**
3. **General** tab:
   - Name: `Xogos Board DB`
4. **Connection** tab:
   - Host: `YOUR_ENDPOINT.rds.amazonaws.com`
   - Port: `5432`
   - Database: `xogos_board`
   - Username: `postgres`
   - Password: `[your password]`
   - ✅ Check: **Save password**
5. Click **Save**
6. If successful, you'll see your database in the left panel

---

### Step 8: Run Database Schema

**Option A: Using psql:**

```bash
# Navigate to your project folder
cd "C:\Users\edwar\OneDrive\Documents\Business\Xogos Gaming, Inc\Xogos Code\XogosBoard"

# Run the schema file
psql -h YOUR_ENDPOINT.rds.amazonaws.com -U postgres -d xogos_board -f database/schema.sql

# You should see:
# CREATE TABLE
# CREATE TABLE
# CREATE TABLE
# CREATE TABLE
# INSERT 0 6
# INSERT 0 1
# INSERT 0 1
# CREATE INDEX
# CREATE INDEX
# CREATE INDEX
# CREATE INDEX
# (success messages)
```

**Option B: Using pgAdmin:**

1. In pgAdmin, connect to your database
2. Click **Tools** → **Query Tool**
3. Open the schema file:
   - Click folder icon → navigate to `database/schema.sql`
   - Or copy-paste the contents from the file
4. Click **Execute/Run** (▶️ button or F5)
5. You should see: "Query returned successfully"

---

### Step 9: Verify Tables Were Created

**Using psql:**

```bash
psql -h YOUR_ENDPOINT.rds.amazonaws.com -U postgres -d xogos_board

# Inside psql, run:
\dt

# You should see:
#                List of relations
#  Schema |         Name          | Type  |  Owner
# --------+-----------------------+-------+----------
#  public | board_member_profiles | table | postgres
#  public | checklist_items       | table | postgres
#  public | xogos_financials      | table | postgres
#  public | xogos_statistics      | table | postgres
```

**Using pgAdmin:**

1. In left panel, expand:
   - **Servers** → **Xogos Board DB** → **Databases** → **xogos_board** → **Schemas** → **public** → **Tables**
2. You should see 4 tables:
   - board_member_profiles
   - checklist_items
   - xogos_financials
   - xogos_statistics

✅ **If you see all 4 tables, database setup is complete!**

---

## Part 3: Configure Environment Variables (5 minutes)

Now we need to tell your app how to connect to the database.

### Step 10: Local Development Environment

**Create/edit `.env.local` in your project root:**

```bash
# Navigate to project folder
cd "C:\Users\edwar\OneDrive\Documents\Business\Xogos Gaming, Inc\Xogos Code\XogosBoard"

# Edit .env.local (create if doesn't exist)
notepad .env.local
```

**Add these lines (replace with YOUR values):**

```bash
# ========================================
# AWS RDS PostgreSQL Database
# ========================================
DATABASE_HOST=YOUR_ENDPOINT.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=xogos_board
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_SSL=true

# ========================================
# Existing Environment Variables (KEEP THESE)
# ========================================
LIVEBLOCKS_SECRET_KEY=sk_prod_...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# (Keep all your other existing variables)
```

**Save and close the file.**

---

### Step 11: AWS Amplify Production Environment

**Add environment variables to Amplify:**

1. Go to https://console.aws.amazon.com/amplify/
2. Select your app: **XogosWebsite**
3. Click **Hosting** → **Environment variables**
4. Click **Manage variables**
5. Add these 6 variables:

| Variable | Value |
|----------|-------|
| DATABASE_HOST | YOUR_ENDPOINT.rds.amazonaws.com |
| DATABASE_PORT | 5432 |
| DATABASE_NAME | xogos_board |
| DATABASE_USER | postgres |
| DATABASE_PASSWORD | your_password_here |
| DATABASE_SSL | true |

6. Click **Save**
7. Amplify will automatically redeploy with new variables

---

## Part 4: Test Everything (5 minutes)

### Step 12: Test Local Development

```bash
# Start your development server
npm run dev

# Look for this in console:
# ✅ Database connected successfully

# If you see errors instead:
# ❌ "connect ECONNREFUSED" → Check DATABASE_HOST
# ❌ "password authentication failed" → Check DATABASE_PASSWORD
# ❌ "database does not exist" → Check DATABASE_NAME is "xogos_board"
```

**If you see "Database connected successfully":**

1. Open browser: http://localhost:3000/admin/statistics
2. Sign in with your admin email
3. You should see the statistics form
4. Enter test values:
   - Accounts: 100
   - Active Users: 25
   - Total Hours: 500
5. Click **Save Statistics**
6. You should see: ✅ "Statistics updated successfully!"
7. Scroll down - you should see a table with your update

---

### Step 13: Verify Data in Database

**Using psql:**

```bash
psql -h YOUR_ENDPOINT.rds.amazonaws.com -U postgres -d xogos_board

# Check statistics were saved:
SELECT * FROM xogos_statistics;

# You should see your test data:
#  id | accounts | active_users | total_hours |      last_updated       |    updated_by
# ----+----------+--------------+-------------+-------------------------+-------------------
#   1 |      100 |           25 |         500 | 2025-12-29 ... | your@email.com

\q
```

**Using pgAdmin:**

1. Right-click **xogos_statistics** table
2. Select **View/Edit Data** → **All Rows**
3. You should see your test data

✅ **If you see your test data, everything is working!**

---

### Step 14: Test Production (After Amplify Redeploys)

1. Wait for Amplify to finish deploying (~5 minutes)
2. Go to your production URL: https://www.histronics.com/admin/statistics
3. Sign in with admin email
4. Update statistics
5. Check if it saves successfully

✅ **If it works, you're 100% done!**

---

## Troubleshooting

### Problem: "connect ECONNREFUSED"

**Causes:**
- Wrong DATABASE_HOST
- Security group not allowing your IP
- Database not running

**Solutions:**
1. Verify endpoint in AWS RDS Console
2. Check security group allows port 5432
3. Verify database status is "Available"

---

### Problem: "password authentication failed"

**Causes:**
- Wrong password in .env.local
- Typo in DATABASE_USER

**Solutions:**
1. Double-check password (no spaces!)
2. Verify DATABASE_USER is "postgres"
3. Try resetting database password in AWS Console

---

### Problem: "database does not exist"

**Causes:**
- DATABASE_NAME typo
- Initial database name not set when creating RDS

**Solutions:**
1. Verify DATABASE_NAME is exactly "xogos_board"
2. Check database exists: `psql -h ... -U postgres -l`
3. Create database if missing: `CREATE DATABASE xogos_board;`

---

### Problem: "relation does not exist"

**Causes:**
- Schema file not run
- Connected to wrong database

**Solutions:**
1. Run schema file: `psql -h ... -f database/schema.sql`
2. Verify you're in xogos_board database: `SELECT current_database();`

---

### Problem: Can't connect from local machine

**Causes:**
- Security group blocking your IP
- Firewall blocking port 5432

**Solutions:**
1. Check security group allows your IP
2. Try: `telnet YOUR_ENDPOINT 5432` (should connect)
3. Temporarily allow 0.0.0.0/0 to test

---

### Problem: Works locally but not on Amplify

**Causes:**
- Environment variables not set in Amplify
- Security group blocking Amplify IPs

**Solutions:**
1. Verify all 6 DATABASE_* variables in Amplify Console
2. Check Amplify build logs for connection errors
3. Security group should allow 0.0.0.0/0 (for now)

---

## Next Steps

Once everything works:

1. ✅ Test the admin interface: `/admin/statistics` and `/admin/financials`
2. ✅ Check board room ticker: `/board` (should show your data)
3. ✅ Make regular updates to build historical data
4. ✅ Set up database backups (AWS does automatically)
5. ✅ Consider setting up CloudWatch alarms for monitoring

---

## Security Hardening (Optional but Recommended)

After confirming everything works:

1. **Restrict security group:**
   - Remove 0.0.0.0/0 rule
   - Add only your office/home IPs
   - Add Amplify NAT Gateway IPs (ask AWS support)

2. **Enable SSL enforcement:**
   ```sql
   ALTER SYSTEM SET ssl = on;
   ```

3. **Create read-only user for analytics:**
   ```sql
   CREATE USER analytics WITH PASSWORD 'secure_password';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;
   ```

4. **Set up CloudWatch alarms:**
   - CPU > 80%
   - Connections > 80% of max
   - Free storage < 2GB

---

## Cost Management

**Free Tier (First 12 months):**
- 750 hours/month of db.t3.micro (enough for 24/7 operation)
- 20GB storage
- 20GB backups
- **Cost: $0/month**

**After Free Tier:**
- db.t3.micro: ~$15/month
- 20GB storage: ~$2.50/month
- Backups (7 days): ~$1/month
- **Total: ~$18/month**

**To reduce costs:**
- Use db.t4g.micro (ARM): ~$12/month
- Reduce backup retention to 1 day: save ~$0.80/month
- Delete old snapshots regularly

---

## Summary Checklist

- [ ] Created RDS PostgreSQL database
- [ ] Configured security group
- [ ] Ran database schema (created 4 tables)
- [ ] Added DATABASE_* variables to .env.local
- [ ] Added DATABASE_* variables to Amplify Console
- [ ] Tested local development (npm run dev)
- [ ] Tested admin interface (/admin/statistics)
- [ ] Verified data saves to database
- [ ] Tested production Amplify deployment
- [ ] Verified board room ticker shows live data

**When all checked: You're done! 🎉**

---

**Questions? Issues?**
- Check the Troubleshooting section above
- Review SETUP_GUIDE.md for additional help
- Check AWS RDS documentation: https://docs.aws.amazon.com/rds/
