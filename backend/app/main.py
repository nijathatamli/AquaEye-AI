from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.router import api_router
import time
import logging

# Configure professional logging formatting
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("aquaeye")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intranet backend core for processing OpenCV stream matrices and feeding Baku early warning networks.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middleware to measure request latencies (critical for live RTSP systems)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Ms"] = f"{process_time * 1000:.2f}"
    return response

# Global exception handler for safety
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal processing error on the local city server", "error": str(exc)}
    )

# Root status page
@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "api_documentation": "/docs",
        "intranet_version": "1.0.0-din-stable",
        "timezone": "AZT (+04:00)"
    }

# Health Check for docker containers and system health status
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "uptime_sec": time.monotonic(),
        "cuda_gpu_detected": False,  # Will be mapped in cuda checks
        "camera_feed_pipelines": "active"
    }

# Include v1 API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    logger.info("===================================================================")
    logger.info("   AquaEye AI Local Processing Core (FastAPI Engine) Starting up   ")
    logger.info("   Running Baku Security Zone - Intranet Deployment Ready        ")
    logger.info("===================================================================")

# Telemetry early warning checkpoint 38
