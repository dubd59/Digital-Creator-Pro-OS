const stripe = require('../config/stripe.cjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a Stripe customer
 */
const createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName || user.username,
      metadata: {
        userId: user.id,
        userUuid: user.uuid
      }
    });
    return customer;
  } catch (error) {
    console.error('Stripe create customer error:', error);
    throw new Error('Failed to create Stripe customer');
  }
};

/**
 * Create a subscription for a user
 */
const createSubscription = async (userId, priceId, paymentMethodId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { userProfileId: userId, stripePaymentMethodId: paymentMethodId }
    });
    if (!paymentMethod) throw new Error('Payment method not found');

    const plan = await prisma.subscriptionPlan.findFirst({
      where: { name: priceId }
    });
    if (!plan) throw new Error('Subscription plan not found');

    // You may need to create a Stripe customer here if not already created
    // const customer = await createCustomer(user);

    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId, // or customer.id if you create above
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent']
    });

    const dbSubscription = await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userProfileId: userId,
        planId: plan.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    return {
      subscription: dbSubscription,
      stripeSubscription: subscription
    };
  } catch (error) {
    console.error('Create subscription error:', error);
    throw new Error('Failed to create subscription');
  }
};

/**
 * Cancel a subscription
 */
const cancelSubscription = async (userId, subscriptionId) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { id: parseInt(subscriptionId), userProfileId: userId }
    });
    if (!subscription) throw new Error('Subscription not found');

    await stripe.subscriptions.del(subscription.stripeSubscriptionId);

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'canceled',
        dateUpdated: new Date()
      }
    });

    return updatedSubscription;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw new Error('Failed to cancel subscription');
  }
};

module.exports = {
  createCustomer,
  createSubscription,
  cancelSubscription
};