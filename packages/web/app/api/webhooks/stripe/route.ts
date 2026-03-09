import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    console.error("No stripe-signature header")
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  console.log("✅ Webhook received:", event.type)

  // イベントタイプごとの処理
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log("💰 Checkout completed:", session.id)
        console.log("  Customer:", session.customer)
        console.log("  Subscription:", session.subscription)
        break

      case "customer.subscription.created":
        const createdSubscription = event.data.object as Stripe.Subscription
        console.log("🆕 Subscription created:", createdSubscription.id)
        console.log("  Status:", createdSubscription.status)
        console.log("  Customer:", createdSubscription.customer)
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log("🔄 Subscription updated:", updatedSubscription.id)
        console.log("  Status:", updatedSubscription.status)
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log("❌ Subscription deleted:", deletedSubscription.id)
        break

      case "invoice.payment_succeeded":
        const successInvoice = event.data.object as Stripe.Invoice
        console.log("✅ Payment succeeded:", successInvoice.id)
        console.log("  Amount:", successInvoice.amount_paid)
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log("❌ Payment failed:", failedInvoice.id)
        break

      default:
        console.log("ℹ️ Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
