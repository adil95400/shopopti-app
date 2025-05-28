import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: 'Missing customer_id' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `${req.headers.origin}/account`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ error: error.message });
  }
}