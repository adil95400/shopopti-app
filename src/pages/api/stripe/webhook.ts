import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  
  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event: Stripe.Event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata
      const userId = session.metadata?.user_id;
      const planId = session.metadata?.plan_id;
      
      if (userId && planId) {
        await handleSuccessfulSubscription(session, userId, planId);
      }
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancellation(subscription);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handleSuccessfulSubscription(
  session: Stripe.Checkout.Session,
  userId: string,
  planId: string
) {
  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    
    // Get plan details
    const plan = getPlanFromPriceId(planId);
    
    // Save to database
    await supabase.from('subscriptions').insert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan: plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    });
    
    // Update user's subscription tier
    await supabase
      .from('users')
      .update({ 
        subscription_tier: plan,
        subscription_status: subscription.status
      })
      .eq('id', userId);
      
  } catch (error) {
    console.error('Error handling successful subscription:', error);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    // Find the subscription in our database
    const { data } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();
      
    if (!data) return;
    
    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
      
    // Update user's subscription status
    await supabase
      .from('users')
      .update({ 
        subscription_status: subscription.status
      })
      .eq('id', data.user_id);
      
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    // Find the subscription in our database
    const { data } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();
      
    if (!data) return;
    
    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
      
    // Update user's subscription status
    await supabase
      .from('users')
      .update({ 
        subscription_tier: 'freemium',
        subscription_status: 'canceled'
      })
      .eq('id', data.user_id);
      
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

function getPlanFromPriceId(priceId: string): string {
  // Map price IDs to plan names
  const pricePlans: Record<string, string> = {
    [process.env.VITE_STRIPE_PRICE_PRO || '']: 'pro',
    [process.env.VITE_STRIPE_PRICE_AGENCY || '']: 'agency'
  };
  
  return pricePlans[priceId] || 'freemium';
}

// Helper to parse the request body as a buffer
async function buffer(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  
  return Buffer.concat(chunks);
}

// Disable body parsing, we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};