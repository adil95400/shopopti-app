from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from backend.api import router

app = FastAPI(docs_url="/docs", openapi_url="/openapi.json")
app.include_router(router)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Shopopti API",
        version="1.0.0",
        description="Shopopti backend API documentation.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
