from fastapi import APIRouter, Request
from supabase import create_client
import httpx
import os

router = APIRouter()

supabase_url = os.getenv("SUPABASE_URL") or ""
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or ""

supabase = create_client(supabase_url, supabase_key)

async def validate_shopify(creds: dict) -> tuple[bool, str | None]:
    url = creds.get("store_url")
    token = creds.get("access_token")
    if not url or not token:
        return False, "store_url and access_token required"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://{url}/admin/api/2024-01/shop.json", headers={"X-Shopify-Access-Token": token}, timeout=10)
        if resp.status_code == 200:
            return True, None
        return False, f"Shopify responded with status {resp.status_code}"
    except Exception as e:
        return False, str(e)

async def validate_woocommerce(creds: dict) -> tuple[bool, str | None]:
    url = creds.get("store_url")
    key = creds.get("consumer_key")
    secret = creds.get("consumer_secret")
    if not url or not key or not secret:
        return False, "store_url, consumer_key and consumer_secret required"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{url}/wp-json/wc/v3", auth=(key, secret), timeout=10)
        if resp.status_code in {200,401}:
            return True, None
        return False, f"WooCommerce responded with status {resp.status_code}"
    except Exception as e:
        return False, str(e)

validators = {
    "shopify": validate_shopify,
    "woocommerce": validate_woocommerce,
}

@router.post("/api/connect/{platform}")
async def connect_platform(platform: str, request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    credentials = body.get("credentials", {})

    if not user_id:
        return {"error": "user_id required"}

    validator = validators.get(platform)
    if not validator:
        return {"error": "unsupported platform"}

    valid, error = await validator(credentials)
    if not valid:
        return {"error": error or "invalid credentials"}

    supabase.table("connected_integrations").insert({
        "user_id": user_id,
        "platform": platform,
        "credentials": credentials,
    }).execute()
    return {"status": "connected"}
