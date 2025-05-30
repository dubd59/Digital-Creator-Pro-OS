const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const subscription = await prisma.subscription.findFirst({
      where: {
        userProfileId: userId,
        status: 'active',
        currentPeriodEnd: {
          gt: new Date()
        }
      }
    });
    
    if (!subscription) {
      return res.status(403).json({
        error: true,
        message: 'Active subscription required to access this feature'
      });
    }
    
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: true, message: 'Failed to verify subscription status' });
  }
};

module.exports = { checkActiveSubscription };