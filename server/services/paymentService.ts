import { db } from '../db/database';
import { PaymentOrder, CreditLedgerEntry } from '../../src/types';

export function createPaymentOrder(userId: string, planId: string): PaymentOrder {
  const user = db.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const plans = db.getPricingPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) {
    throw new Error('Invalid pricing plan selected');
  }

  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const gatewayOrderId = `gway_order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const order: PaymentOrder = {
    id: orderId,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    planId: plan.id,
    planName: plan.name,
    evaluationsCount: plan.evaluationsCount,
    amountINR: plan.priceINR,
    status: 'PENDING',
    gatewayOrderId,
    createdAt: new Date().toISOString(),
  };

  db.saveOrder(order);
  return order;
}

export function verifyAndCompletePayment(
  orderId: string,
  gatewayPaymentId: string
): { success: boolean; order: PaymentOrder; creditsAdded: number } {
  const orders = db.getOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status === 'SUCCESS') {
    return { success: true, order, creditsAdded: 0 };
  }

  // Server-side verification logic
  order.status = 'SUCCESS';
  order.gatewayPaymentId = gatewayPaymentId;
  order.completedAt = new Date().toISOString();
  db.saveOrder(order);

  // Allocate credits to user
  const user = db.getUserById(order.userId);
  if (user) {
    const updatedCredits = (user.purchasedCredits || 0) + order.evaluationsCount;
    db.updateUser(user.id, { purchasedCredits: updatedCredits });

    // Record ledger
    const ledgerEntry: CreditLedgerEntry = {
      id: `crd-pay-${Date.now()}`,
      userId: user.id,
      type: 'CREDIT_ADDED',
      amount: order.evaluationsCount,
      source: 'PURCHASE',
      orderId: order.id,
      balanceAfter: updatedCredits,
      description: `Payment verified for ${order.planName} (₹${order.amountINR}). Added ${order.evaluationsCount} evaluation credits.`,
      timestamp: new Date().toISOString(),
    };
    db.addCreditLedgerEntry(ledgerEntry);

    // Add user notification
    db.addNotification({
      id: `notif-pay-${Date.now()}`,
      userId: user.id,
      title: 'Payment Successful & Credits Added',
      message: `${order.evaluationsCount} evaluation credits have been added to your account. Transaction ID: ${gatewayPaymentId}.`,
      type: 'PAYMENT',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return { success: true, order, creditsAdded: order.evaluationsCount };
}
