FROM python:3.11

# Arguments for User ID and Group ID
ARG USER_ID=1000
ARG GROUP_ID=1000

# Create a user with the same UID/GID as the host
RUN groupadd -g $GROUP_ID devgroup && \
    useradd -m -u $USER_ID -g devgroup devuser

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

# Switch to the newly created user
USER devuser

# Copy the necessary files and install dependencies using Poetry
COPY --chown=devuser:devgroup pyproject.toml poetry.lock* /backend/
RUN poetry install --no-root --no-cache --only main

# Copy the rest of the app files
COPY --chown=devuser:devgroup . .

# Default command to run the application
CMD ["python", "main.py"]
