# Stripe Financial Dashboard Setup Guide

This guide walks you through setting up the Stripe integration for the Financial Dashboard.

---

## Overview

The Financial Dashboard displays membership metrics synced from Stripe:
- Total members (monthly, yearly, lifetime)
- New members this month
- Lost members (cancellations)
- Monthly revenue
- Churn rate
- Revenue trend (6 months)

**Access Control:** Only users in the `audit_committee` group can access the dashboard.

---

## Step 1: Run the Database Schema

Run this SQL in your Supabase SQL Editor to create the required tables:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `database/stripe-schema.sql` and copy its contents
4. Paste and run in Supabase

This creates:
- `stripe_events` - Logs all webhook events
- `stripe_customers` - Customer information
- `stripe_subscriptions` - Subscription details
- `stripe_payments` - Payment records

---

## Step 2: Get Your Stripe API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

---

## Step 3: Set Up Stripe Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://www.histronics.com/api/stripe-webhook
   ```
4. Select these events to listen to:
   - `customer.created`
   - `customer.updated`
   - `customer.deleted`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. After creation, click on your webhook and click **Reveal** to see the **Signing secret** (starts with `whsec_`)

---

## Step 4: Add Environment Variables to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Go to **Environment variables**
4. Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Your Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signing secret |

5. Save and trigger a new deployment

---

## Step 5: Configure Stripe Products (if not done)

Make sure your Stripe account has membership products configured:

### Monthly Membership
- Create a product with a **recurring** price (monthly interval)

### Yearly Membership
- Create a product with a **recurring** price (yearly interval)

### Lifetime Membership
- Create a product with a **one-time** price

The system automatically detects subscription type based on the price interval.

---

## Step 6: Install Dependencies

Run this command to install the Stripe package:

```bash
npm install stripe
```

---

## Step 7: Test the Webhook

### Using Stripe CLI (Recommended for Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward events to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
4. The CLI will give you a temporary webhook secret for testing

### Using Stripe Dashboard

1. Go to your webhook in Stripe Dashboard
2. Click **Send test webhook**
3. Select an event type (e.g., `customer.subscription.created`)
4. Click **Send test webhook**
5. Check your server logs for confirmation

---

## Step 8: Add Users to Audit Committee

To grant dashboard access:

1. Log in as an admin
2. Go to the Groups management page in your dashboard
3. Add users to the `audit_committee` group
4. Those users can now access `/finance`

Currently, Michael Weaver (`enjoyweaver@gmail.com`) is already in the audit_committee group.

---

## How It Works

### Data Flow
```
Customer signs up on your site
    ↓
Stripe processes payment
    ↓
Stripe sends webhook to /api/stripe-webhook
    ↓
Webhook handler:
  1. Verifies signature
  2. Logs event to stripe_events
  3. Updates stripe_customers
  4. Updates stripe_subscriptions
  5. Records payment to stripe_payments
    ↓
Financial Dashboard queries aggregated data
    ↓
Audit Committee members see metrics
```

### Access Control Flow
```
User visits /finance
    ↓
Check if authenticated (NextAuth session)
    ↓
If not authenticated → Redirect to /signin
    ↓
Check audit_committee membership
    ↓
If not in audit_committee → Show access denied, link to /dashboard
    ↓
If authorized → Show financial dashboard
```

---

## Troubleshooting

### Webhook Returns 400 (Invalid Signature)
- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Make sure you're using the signing secret for THIS endpoint
- Check that the request body is not being modified

### No Data in Dashboard
- Verify webhooks are being received (check Stripe Dashboard → Webhooks → Events)
- Check server logs for errors
- Ensure database tables exist

### Access Denied
- Verify user email is in the `user_groups` table with `audit_committee` group
- Check that the user is signing in with the correct email

---

## Files Created

| File | Purpose |
|------|---------|
| `app/api/stripe-webhook/route.ts` | Webhook endpoint handler |
| `app/finance/page.tsx` | Financial dashboard page |
| `app/finance/page.module.css` | Dashboard styles |
| `lib/auth/financial.ts` | Audit committee access check |
| `lib/actions/getMembershipMetrics.ts` | Server action for metrics |
| `database/stripe-schema.sql` | SQL schema for Stripe tables |

---

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signing secret |
| `DATABASE_HOST` | Yes | Supabase pooler host |
| `DATABASE_PORT` | Yes | Database port (5432 or 6543) |
| `DATABASE_NAME` | Yes | Database name (postgres) |
| `DATABASE_USER` | Yes | Database user |
| `DATABASE_PASSWORD` | Yes | Database password |
| `DATABASE_SSL` | Yes | SSL mode (true) |

---

## Testing Checklist

- [ ] SQL schema executed in Supabase
- [ ] Stripe API key added to Amplify
- [ ] Stripe webhook secret added to Amplify
- [ ] Webhook endpoint created in Stripe
- [ ] Test webhook sent successfully
- [ ] Dashboard accessible at /finance
- [ ] Non-audit users redirected to /dashboard
- [ ] Metrics display correctly

---

*Last updated: February 2026*
