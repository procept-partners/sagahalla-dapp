# Backend Dockerfile

FROM python:3.11

# Set the working directory
WORKDIR /backend

# Set environment variables
ENV PYTHONPATH=/backend
ENV POETRY_HOME=/opt/poetry

# Install Poetry and set it up
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Install Chromium and Chromium Driver
RUN apt update && apt install -y chromium chromium-driver

# Switch to the root user
USER root

# Copy the necessary files and install dependencies using Poetry
COPY --chown=root:root pyproject.toml poetry.lock* /backend/
RUN poetry install --no-root --no-cache

# Copy the rest of the app files
COPY --chown=root:root . .

# Default command to run the application
CMD ["python", "main.py"]

