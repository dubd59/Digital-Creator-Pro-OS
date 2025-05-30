const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe.cjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object;
          const dbSubscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id }
          });
          if (dbSubscription) {
            await prisma.subscription.update({
              where: { id: dbSubscription.id },
              data: {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                dateUpdated: new Date()
              }
            });
          }
        }
        break;
      case 'customer.subscription.deleted':
        {
          const canceledSubscription = event.data.object;
          const canceledDbSubscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: canceledSubscription.id }
          });
          if (canceledDbSubscription) {
            await prisma.subscription.update({
              where: { id: canceledDbSubscription.id },
              data: {
                status: 'canceled',
                dateUpdated: new Date()
              }
            });
          }
        }
        break;
      case 'invoice.payment_succeeded':
        {
          const invoice = event.data.object;
          const invoiceSubscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: invoice.subscription }
          });
          if (invoiceSubscription) {
            const dbInvoice = await prisma.invoice.create({
              data: {
                stripeInvoiceId: invoice.id,
                subscriptionId: invoiceSubscription.id,
                amountDue: invoice.amount_due / 100,
                status: invoice.status,
                date: new Date(invoice.created * 1000)
              }
            });
            for (const item of invoice.lines.data) {
              await prisma.invoiceItem.create({
                data: {
                  invoiceId: dbInvoice.id,
                  description: item.description,
                  amount: item.amount / 100,
                  quantity: item.quantity
                }
              });
            }
          }
        }
        break;
    }
    
    // Log the webhook event
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        endpointId: 1,
        eventType: event.type,
        payload: JSON.stringify(event),
        receivedAt: new Date()
      }
    });
    
    res.json({ received: true });
  } catch (error) {
    console.error(`Webhook processing error: ${error.message}`);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
});

module.exports = router;