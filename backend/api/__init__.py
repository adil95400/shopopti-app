from fastapi import APIRouter
from .stripe_checkout import router as stripe_checkout_router
from .stripe_webhook import router as stripe_webhook_router
from .connect import router as connect_router
from .import_extension import router as import_extension_router

router = APIRouter()
router.include_router(stripe_checkout_router)
router.include_router(stripe_webhook_router)
router.include_router(connect_router)
router.include_router(import_extension_router)
