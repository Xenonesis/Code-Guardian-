# 🔗 DocMagic Webhooks Documentation

<div align="center">

![Webhooks](https://img.shields.io/badge/Webhooks-Documentation-FF6B6B?style=for-the-badge)
![Real-time](https://img.shields.io/badge/Real--time-Events-4ECDC4?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Webhooks-626CD9?style=for-the-badge&logo=stripe)

</div>

## 📋 Overview

DocMagic uses webhooks to notify your application about events that happen in real-time. This guide covers webhook setup, event types, and security best practices.

## 🎯 Supported Webhooks

### Stripe Payment Webhooks

DocMagic handles the following Stripe webhook events:

#### Subscription Events
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`

#### Payment Events
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

#### Customer Events
- `customer.created`
- `customer.updated`
- `customer.deleted`

## 🔧 Webhook Setup

### Stripe Webhook Configuration

1. **Create Webhook Endpoint in Stripe Dashboard**
   ```
   Endpoint URL: https://your-domain.com/api/stripe/webhook
   Events to send: Select the events listed above
   ```

2. **Environment Variables**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   STRIPE_SECRET_KEY=sk_your_stripe_secret_key
   ```

### Webhook Handler Implementation

```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

## 📨 Event Handlers

### Subscription Created

```typescript
const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  
  // Update user subscription status in database
  await supabase
    .from('subscriptions')
    .insert({
      user_id: subscription.metadata.user_id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    })

  // Send welcome email
  await sendWelcomeEmail(subscription.metadata.user_email)
}
```

### Subscription Updated

```typescript
const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    })
    .eq('stripe_subscription_id', subscription.id)

  // Handle subscription cancellation
  if (subscription.status === 'canceled') {
    await handleSubscriptionCanceled(subscription)
  }
}
```

### Payment Succeeded

```typescript
const handlePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.subscription as string
  
  // Update payment history
  await supabase
    .from('payments')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      paid_at: new Date(invoice.status_transitions.paid_at! * 1000)
    })

  // Send payment confirmation email
  await sendPaymentConfirmationEmail(invoice)
}
```

## 🔒 Security Best Practices

### Webhook Signature Verification

Always verify webhook signatures to ensure requests are from Stripe:

```typescript
const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret)
    return true
  } catch (err) {
    return false
  }
}
```

### Idempotency

Handle duplicate webhook deliveries:

```typescript
const processWebhookEvent = async (event: Stripe.Event) => {
  // Check if event was already processed
  const existingEvent = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single()

  if (existingEvent.data) {
    console.log(`Event ${event.id} already processed`)
    return
  }

  // Process the event
  await handleEvent(event)

  // Mark event as processed
  await supabase
    .from('webhook_events')
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      processed_at: new Date()
    })
}
```

## 📊 Webhook Monitoring

### Logging Webhook Events

```typescript
const logWebhookEvent = async (event: Stripe.Event, status: 'success' | 'error', error?: string) => {
  await supabase
    .from('webhook_logs')
    .insert({
      event_id: event.id,
      event_type: event.type,
      status,
      error_message: error,
      created_at: new Date()
    })
}
```

### Webhook Health Check

```typescript
// app/api/webhooks/health/route.ts
export async function GET() {
  const recentEvents = await supabase
    .from('webhook_logs')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
    .order('created_at', { ascending: false })

  const totalEvents = recentEvents.data?.length || 0
  const errorEvents = recentEvents.data?.filter(e => e.status === 'error').length || 0
  const successRate = totalEvents > 0 ? ((totalEvents - errorEvents) / totalEvents) * 100 : 100

  return NextResponse.json({
    status: 'healthy',
    last_24_hours: {
      total_events: totalEvents,
      error_events: errorEvents,
      success_rate: `${successRate.toFixed(2)}%`
    }
  })
}
```

## 🚨 Error Handling

### Retry Logic

```typescript
const processWebhookWithRetry = async (event: Stripe.Event, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await processWebhookEvent(event)
      return
    } catch (error) {
      console.error(`Webhook processing attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        // Send alert to monitoring system
        await sendWebhookAlert(event, error)
        throw error
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}
```

### Dead Letter Queue

```typescript
const handleFailedWebhook = async (event: Stripe.Event, error: Error) => {
  await supabase
    .from('failed_webhooks')
    .insert({
      event_id: event.id,
      event_type: event.type,
      event_data: event.data,
      error_message: error.message,
      retry_count: 0,
      created_at: new Date()
    })
}
```

## 🧪 Testing Webhooks

### Local Development with Stripe CLI

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

### Webhook Testing Endpoint

```typescript
// app/api/webhooks/test/route.ts
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const { eventType, data } = await req.json()

  // Simulate webhook event
  const testEvent = {
    id: `evt_test_${Date.now()}`,
    type: eventType,
    data: { object: data },
    created: Math.floor(Date.now() / 1000)
  }

  await processWebhookEvent(testEvent as Stripe.Event)

  return NextResponse.json({ success: true, event: testEvent })
}
```

## 📈 Webhook Analytics

### Event Processing Metrics

```typescript
const getWebhookMetrics = async (days = 7) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const metrics = await supabase
    .from('webhook_logs')
    .select('event_type, status, created_at')
    .gte('created_at', startDate.toISOString())

  return {
    total_events: metrics.data?.length || 0,
    success_rate: calculateSuccessRate(metrics.data || []),
    events_by_type: groupEventsByType(metrics.data || []),
    daily_volume: getDailyVolume(metrics.data || [])
  }
}
```

## 🔗 Related Documentation

- [API Documentation](./API.md)
- [Authentication Guide](./AUTH.md)
- [Security Policy](./SECURITY.md)

---

<div align="center">

**Need help?** Check our [troubleshooting guide](./TROUBLESHOOTING.md) or [contact support](mailto:support@docmagic.com).

</div>