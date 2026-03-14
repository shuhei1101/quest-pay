import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { logger } from "@/app/(core)/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  logger.info('Stripe webhook受信開始', {
    path: '/api/webhooks/stripe',
    method: 'POST',
  })

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    logger.error('Stripe signatureヘッダーが存在しない')
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
    logger.debug('Webhook署名検証成功', { eventType: event.type })
  } catch (err) {
    logger.error('Webhook署名検証失敗', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  logger.info('Webhook受信成功', { eventType: event.type })

  // イベントタイプごとの処理
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        logger.info('Checkout完了', {
          sessionId: session.id,
          customer: session.customer,
          subscription: session.subscription,
        })
        break

      case "customer.subscription.created":
        const createdSubscription = event.data.object as Stripe.Subscription
        logger.info('サブスクリプション作成', {
          subscriptionId: createdSubscription.id,
          status: createdSubscription.status,
          customer: createdSubscription.customer,
        })
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        logger.info('サブスクリプション更新', {
          subscriptionId: updatedSubscription.id,
          status: updatedSubscription.status,
        })
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        logger.info('サブスクリプション削除', {
          subscriptionId: deletedSubscription.id,
        })
        break

      case "invoice.payment_succeeded":
        const successInvoice = event.data.object as Stripe.Invoice
        logger.info('支払い成功', {
          invoiceId: successInvoice.id,
          amount: successInvoice.amount_paid,
        })
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        logger.warn('支払い失敗', {
          invoiceId: failedInvoice.id,
        })
        break

      default:
        logger.debug('未対応のwebhookイベント', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook処理中にエラー発生', {
      error: error instanceof Error ? error.message : String(error),
      eventType: event.type,
    })
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
