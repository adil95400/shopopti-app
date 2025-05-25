from fastapi import APIRouter, Request, Header
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, endpoint_secret)
    except stripe.error.SignatureVerificationError:
        return {"error": "Signature invalide"}

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_customer = session.get("customer")
        stripe_subscription = session.get("subscription")
        user_id = session.get("metadata", {}).get("user_id")
        plan = session.get("display_items", [{}])[0].get("plan", {}).get("nickname", "unknown")

        from supabase import create_client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = create_client(supabase_url, supabase_key)

        supabase.table("subscriptions").insert({
            "user_id": user_id,
            "stripe_customer_id": stripe_customer,
            "stripe_subscription_id": stripe_subscription,
            "plan": plan,
            "status": "active"
        }).execute()

    return {"received": True}


    if event["type"] in ["customer.subscription.deleted", "invoice.payment_failed"]:
        subscription = event["data"]["object"]
        stripe_subscription_id = subscription.get("id")
        from supabase import create_client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = create_client(supabase_url, supabase_key)
        supabase.table("subscriptions").update({"status": "canceled"}).eq("stripe_subscription_id", stripe_subscription_id).execute()
