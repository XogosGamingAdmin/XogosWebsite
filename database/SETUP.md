# Database Setup Guide

This project uses Supabase (PostgreSQL) to store board member data.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - **Project Name**: XogosBoard (or any name you like)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest to your users (e.g., US East)
   - Click "Create new project"

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `database/schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success. No rows returned"

This creates all the tables and inserts default data.

## Step 3: Get Your API Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

## Step 4: Add Credentials to Your Project

1. Open your project folder
2. Create or edit the `.env.local` file in the root directory
3. Add these lines (replace with your actual values):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Save the file
5. Restart your development server if it's running

## Step 5: Add Environment Variables to AWS Amplify

1. Go to your AWS Amplify console
2. Open your app
3. Click "Environment variables" in the left menu
4. Add these two variables:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`, **Value**: (your Supabase URL)
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, **Value**: (your Supabase anon key)
5. Click "Save"
6. Redeploy your app

## Step 6: Verify It Works

1. Sign in to your dashboard
2. Go to the Admin page
3. Create a checklist item
4. Refresh the page
5. The checklist item should still be there!

## Troubleshooting

**Error: "Supabase credentials not found"**
- Make sure `.env.local` has the correct variables
- Restart your development server

**Error: "Failed to fetch"**
- Check that your Supabase project is active (not paused)
- Verify the URL and key are correct
- Check Row Level Security policies in Supabase

**Checklist items still disappearing**
- Make sure you added the environment variables to AWS Amplify
- Redeploy your app after adding the variables

## Database Tables

The schema creates these tables:

1. **board_member_profiles** - Stores RSS topic preferences
2. **checklist_items** - Stores monthly checklist tasks
3. **xogos_statistics** - Stores Xogos statistics (accounts, users, hours)
4. **xogos_financials** - Stores financial data (revenue, expenses, members)

All data is now persistent and survives page refreshes!
