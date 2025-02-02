FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-traditional \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
