const { PrismaClient } = require('@prisma/client');
const { createSubscription, cancelSubscription } = require('../services/stripeService.cjs');
const prisma = new PrismaClient();

// Get subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    res.json({ plans });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ error: true, message: 'Failed to get subscription plans' });
  }
};

// Get user's active subscriptions
const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userProfileId: userId
      },
      include: {
        plan: true
      }
    });
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    res.status(500).json({ error: true, message: 'Failed to get user subscriptions' });
  }
};

// Create a new subscription
const createUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priceId, paymentMethodId } = req.body;

    if (!priceId || !paymentMethodId) {
      return res.status(400).json({
        error: true,
        message: 'Price ID and payment method ID are required'
      });
    }

    const result = await createSubscription(userId, priceId, paymentMethodId);

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: result.subscription,
      clientSecret: result.stripeSubscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: true, message: 'Failed to create subscription' });
  }
};

// Cancel a subscription
const cancelUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    const canceledSubscription = await cancelSubscription(userId, subscriptionId);

    res.json({
      message: 'Subscription canceled successfully',
      subscription: canceledSubscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: true, message: 'Failed to cancel subscription' });
  }
};

module.exports = {
  getSubscriptionPlans,
  getUserSubscriptions,
  createUserSubscription,
  cancelUserSubscription
};