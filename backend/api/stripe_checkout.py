from fastapi import APIRouter, Request
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/api/stripe/checkout-session")
async def create_checkout_session(request: Request):
    body = await request.json()
    price_id = body.get("price_id")
    user_id = body.get("user_id")

    try:
        session = stripe.checkout.Session.create(
            success_url=os.getenv("STRIPE_SUCCESS_URL"),
            cancel_url=os.getenv("STRIPE_CANCEL_URL"),
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            metadata={"user_id": user_id}
        )
        return { "url": session.url }
    except Exception as e:
        return { "error": str(e) }
