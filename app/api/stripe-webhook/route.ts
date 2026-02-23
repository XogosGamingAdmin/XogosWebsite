import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/database";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// Webhook endpoint secret for verifying Stripe signatures
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Log the event to the database
    await db.logStripeEvent(event.id, event.type, JSON.stringify(event.data));

    // Handle different event types
    switch (event.type) {
      case "customer.created":
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await db.upsertStripeCustomer({
          stripeCustomerId: customer.id,
          email: customer.email || "",
          name: customer.name || "",
          metadata: customer.metadata,
        });
        break;
      }

      case "customer.deleted": {
        const customer = event.data.object as Stripe.Customer;
        await db.deleteStripeCustomer(customer.id);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

        // Get the price to determine subscription type
        const priceId = subscription.items.data[0]?.price?.id || "";
        const interval = subscription.items.data[0]?.price?.recurring?.interval || "month";

        // Determine subscription type based on interval
        let subscriptionType = "monthly";
        if (interval === "year") {
          subscriptionType = "yearly";
        } else if (!subscription.items.data[0]?.price?.recurring) {
          subscriptionType = "lifetime";
        }

        await db.upsertStripeSubscription({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: customerId,
          stripePriceId: priceId,
          subscriptionType,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db.updateStripeSubscriptionStatus(subscription.id, "canceled");
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id || "";

        if (customerId && invoice.amount_paid) {
          await db.recordStripePayment({
            stripeCustomerId: customerId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid / 100, // Convert from cents
            currency: invoice.currency,
            paidAt: invoice.status_transitions?.paid_at
              ? new Date(invoice.status_transitions.paid_at * 1000)
              : new Date(),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for invoice ${invoice.id}`);
        // You can add additional handling here (e.g., send notification)
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
