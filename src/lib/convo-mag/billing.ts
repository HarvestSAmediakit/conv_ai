// src/lib/convo-mag/billing.ts
import { withTenant } from './db';
import Stripe from 'stripe';

/**
 * Handles Stripe webhook events to synchronize subscriptions and update entitlements.
 * Uses database unique constraints to guarantee event processing is idempotent.
 */
export async function processBillingWebhook(event: Stripe.Event): Promise<void> {
  const stripeSubscriptionId = (event.data.object as any).id;
  const stripeCustomerId = (event.data.object as any).customer as string;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      const tenantId = (subscription.metadata as any).tenantId; // Metadata mapping bound during session configuration
      const planId = (subscription.items.data[0].price as any).lookup_key || 'tier_basic';
      const status = subscription.status;
      const periodEnd = new Date(subscription.current_period_end * 1000);

      if (!tenantId) {
        throw new Error(`Stripe object missing tenantId metadata identifier.`);
      }

      await withTenant(tenantId, async (client) => {
        // Record the transaction payload
        await client.query(
          `INSERT INTO subscriptions (tenant_id, stripe_customer_id, stripe_subscription_id, plan_id, status, current_period_end, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (stripe_subscription_id)
           DO UPDATE SET plan_id = EXCLUDED.plan_id, status = EXCLUDED.status, current_period_end = EXCLUDED.current_period_end, updated_at = NOW()`,
          [tenantId, stripeCustomerId, stripeSubscriptionId, planId, status, periodEnd]
        );

        // Fetch limits associated with the targeted pricing tier
        const planResult = await client.query(
          `SELECT max_documents, max_podcasts, chat_enabled FROM plans WHERE id = $1`,
          [planId]
        );

        if (planResult.rows.length > 0) {
          const plan = planResult.rows[0];

          // Synchronize cached user entitlement constraints
          await client.query(
            `INSERT INTO tenant_entitlements (tenant_id, plan_id, max_documents, max_podcasts, chat_enabled, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (tenant_id)
             DO UPDATE SET plan_id = EXCLUDED.plan_id, max_documents = EXCLUDED.max_documents,
                           max_podcasts = EXCLUDED.max_podcasts, chat_enabled = EXCLUDED.chat_enabled, updated_at = NOW()`,
            [tenantId, planId, plan.max_documents, plan.max_podcasts, plan.chat_enabled]
          );
        }
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const tenantId = (subscription.metadata as any).tenantId;

      if (!tenantId) {
        throw new Error(`Stripe metadata is missing tenantId reference details.`);
      }

      await withTenant(tenantId, async (client) => {
        // Mark the active billing subscription canceled
        await client.query(
          `UPDATE subscriptions SET status = 'canceled', updated_at = NOW() WHERE stripe_subscription_id = $1`,
          [stripeSubscriptionId]
        );

        // Instantly suspend app permissions
        await client.query(
          `UPDATE tenant_entitlements 
           SET max_documents = 0, max_podcasts = 0, chat_enabled = FALSE, updated_at = NOW()
           WHERE tenant_id = $1`,
          [tenantId]
        );
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      const tenantId = invoice.subscription_details?.metadata?.tenantId || (invoice as any).metadata?.tenantId;

      if (tenantId) {
        await withTenant(tenantId, async (client) => {
          // Flag unpaid status to prompt payment collection overlays
          await client.query(
            `UPDATE subscriptions SET status = 'past_due', updated_at = NOW() WHERE stripe_subscription_id = $1`,
            [invoice.subscription as string]
          );
        });
      }
      break;
    }

    default:
      break;
  }
}
