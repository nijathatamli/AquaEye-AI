# ═══════════════════════════════════════════════════════════════════════
#  STAGE 1: Builder (Install dependencies & CUDA toolkit components)
# ═══════════════════════════════════════════════════════════════════════
FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-pip \
    python3-dev \
    build-essential \
    g++ \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY requirements.txt .

# Install dependencies into a localized wheelhouse / site-packages target
RUN pip3 install --no-cache-dir --user -r requirements.txt

# ═══════════════════════════════════════════════════════════════════════
#  STAGE 2: Final Production Image (Lean & Secure)
# ═══════════════════════════════════════════════════════════════════════
FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04 AS production

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PATH=/root/.local/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgstreamer1.0-0 \
    libgstreamer-plugins-base1.0-0 \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-rtsp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed site-packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application source code
COPY ./app /app/app
COPY ./tests /app/tests

EXPOSE 8000

# Check health of the FastAPI process
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=2)" || exit 1

# Start Uvicorn ASGI Server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
