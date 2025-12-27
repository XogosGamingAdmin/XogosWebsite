# AWS RDS PostgreSQL Setup Guide

This project uses AWS RDS (Amazon Relational Database Service) with PostgreSQL for persistent data storage.

## Prerequisites

- AWS Account with billing enabled
- Access to AWS Console

## Step 1: Create RDS PostgreSQL Database (10 minutes)

### 1.1 Navigate to RDS

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Search for "RDS" in the top search bar
3. Click on **RDS** (Relational Database Service)

### 1.2 Create Database

1. Click **"Create database"** button
2. Choose creation method: **Standard create**
3. Engine options:
   - **Engine type**: PostgreSQL
   - **Engine Version**: PostgreSQL 15.x (latest stable)
4. Templates: **Free tier** (if available, otherwise choose Dev/Test)
5. Settings:
   - **DB instance identifier**: `xogos-board-db`
   - **Master username**: `postgres` (default)
   - **Master password**: Create a strong password (save this!)
   - **Confirm password**: Re-enter the password

### 1.3 Instance Configuration

1. **DB instance class**:
   - Free tier: db.t3.micro (if eligible)
   - Production: db.t3.small or larger
2. **Storage**:
   - Storage type: General Purpose SSD (gp3)
   - Allocated storage: 20 GB
   - Uncheck "Enable storage autoscaling" (for cost control)

### 1.4 Connectivity

1. **Compute resource**: Don't connect to an EC2 compute resource
2. **Network type**: IPv4
3. **VPC**: Default VPC
4. **Public access**: **Yes** (important! - allows Amplify to connect)
5. **VPC security group**: Create new
   - **New VPC security group name**: `xogos-board-db-sg`
6. **Availability Zone**: No preference
7. **Database port**: 5432 (default)

### 1.5 Database Authentication

- Choose **Password authentication**

### 1.6 Additional Configuration

1. Expand **"Additional configuration"**
2. **Initial database name**: `xogosboard` (important!)
3. **DB parameter group**: default
4. **Backup**:
   - Uncheck "Enable automated backups" (optional, for cost savings in dev)
5. **Encryption**: Keep default (enabled)
6. **Monitoring**: Uncheck "Enable Enhanced monitoring" (optional, for cost savings)
7. **Maintenance**: Keep defaults

### 1.7 Create the Database

1. Review all settings
2. Click **"Create database"**
3. Wait 5-10 minutes for the database to be created
4. Status will change from "Creating" to "Available"

## Step 2: Configure Security Group

### 2.1 Allow External Connections

1. Click on your database instance `xogos-board-db`
2. Scroll to **Connectivity & security** tab
3. Under **Security**, click on the VPC security group (e.g., `xogos-board-db-sg`)
4. Click **"Inbound rules"** tab
5. Click **"Edit inbound rules"**
6. You should see a PostgreSQL rule (port 5432) with source from your IP
7. Click **"Add rule"**:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: Custom - `0.0.0.0/0` (allows all IPv4)
   - **Description**: Allow from anywhere (for Amplify)
8. Click **"Save rules"**

⚠️ **Security Note**: For production, restrict to specific IPs or use VPC peering. This allows connections from AWS Amplify and your development machine.

## Step 3: Get Database Connection Information

1. Go back to RDS → Databases
2. Click on `xogos-board-db`
3. Under **Connectivity & security**, note these values:
   - **Endpoint**: Something like `xogos-board-db.xxxxxx.us-east-1.rds.amazonaws.com`
   - **Port**: 5432
   - **Database name**: xogosboard

## Step 4: Run Database Schema

### 4.1 Install PostgreSQL Client (if not installed)

**Windows**:
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**Mac**:
```bash
brew install postgresql
```

**Linux**:
```bash
sudo apt-get install postgresql-client
```

### 4.2 Connect to Database

```bash
psql -h xogos-board-db.xxxxxx.us-east-1.rds.amazonaws.com -U postgres -d xogosboard
```

Enter your master password when prompted.

### 4.3 Run Schema SQL

1. Open `database/schema.sql` from your project
2. Copy the entire contents
3. In the `psql` prompt, paste and press Enter
4. You should see:
   ```
   CREATE TABLE
   CREATE TABLE
   ...
   INSERT 0 6
   ```

Alternatively, run from command line:
```bash
psql -h YOUR_ENDPOINT -U postgres -d xogosboard -f database/schema.sql
```

Type `\dt` to verify tables were created. You should see:
- board_member_profiles
- checklist_items
- xogos_financials
- xogos_statistics

Type `\q` to exit.

## Step 5: Add Environment Variables Locally

Create or edit `.env.local` in your project root:

```env
DATABASE_HOST=xogos-board-db.xxxxxx.us-east-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=xogosboard
DATABASE_USER=postgres
DATABASE_PASSWORD=your_master_password_here
DATABASE_SSL=true
```

Replace `xogos-board-db.xxxxxx.us-east-1.rds.amazonaws.com` with your actual endpoint.

## Step 6: Add Environment Variables to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Select your app
3. Click **Environment variables** in the left menu
4. Click **Manage variables**
5. Add these 6 variables:
   - **DATABASE_HOST**: (your RDS endpoint)
   - **DATABASE_PORT**: 5432
   - **DATABASE_NAME**: xogosboard
   - **DATABASE_USER**: postgres
   - **DATABASE_PASSWORD**: (your master password)
   - **DATABASE_SSL**: true
6. Click **Save**
7. Go to your app's main page
8. Click **Redeploy this version** to apply the new environment variables

## Step 7: Test the Connection

After deployment:

1. Sign in to your dashboard at https://www.histronics.com/dashboard
2. Go to **Admin** → **Checklists**
3. Create a checklist item
4. Refresh the page
5. ✅ The item should still be there!

## Troubleshooting

### Cannot connect to database

**Error**: `connect ETIMEDOUT` or `connection refused`

**Solutions**:
1. Check security group allows inbound connections on port 5432
2. Verify **Public access** is set to "Yes" on your RDS instance
3. Check your endpoint is correct (no typos)
4. Verify database status is "Available" in RDS console

### Database credentials not found

**Error**: Warning in console about missing credentials

**Solutions**:
1. Verify all 6 environment variables are set in AWS Amplify
2. Redeploy your app after adding variables
3. Check `.env.local` for local development

### Table does not exist

**Error**: `relation "checklist_items" does not exist`

**Solutions**:
1. Run the `database/schema.sql` file using `psql`
2. Verify you're connected to the correct database (`xogosboard`)
3. Check tables exist with `\dt` command in psql

### SSL connection error

**Error**: `no pg_hba.conf entry` or SSL errors

**Solutions**:
1. Set `DATABASE_SSL=true` in environment variables
2. RDS requires SSL connections by default

## Cost Optimization

### Free Tier Eligibility
- AWS Free Tier includes 750 hours/month of db.t3.micro for 12 months
- 20 GB of storage free
- This is enough for development/testing

### After Free Tier

Estimated monthly cost for production:
- db.t3.small: ~$30/month
- 20GB storage: ~$2/month
- Total: ~$32/month

To reduce costs:
- Use db.t3.micro: ~$15/month
- Delete database when not in use (export data first!)
- Use automated backups sparingly

## Database Maintenance

### Backup Database

```bash
pg_dump -h YOUR_ENDPOINT -U postgres -d xogosboard > backup.sql
```

### Restore Database

```bash
psql -h YOUR_ENDPOINT -U postgres -d xogosboard < backup.sql
```

### View Checklist Items

```sql
psql -h YOUR_ENDPOINT -U postgres -d xogosboard
SELECT * FROM checklist_items;
```

## Security Best Practices

1. **Change default password** regularly
2. **Restrict security group** to specific IPs in production
3. **Enable automated backups** for production
4. **Use Secrets Manager** to store database credentials
5. **Enable encryption** (already default)
6. **Monitor connections** using CloudWatch

## Need Help?

- AWS RDS Documentation: https://docs.aws.amazon.com/rds/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Check CloudWatch Logs in AWS for database errors
