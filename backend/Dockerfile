# Use the official Python image as a parent image
FROM python:3.11

# Set the working directory
WORKDIR /backend

# Install Poetry
RUN pip install poetry

# Disable Poetry's virtual environment creation
RUN poetry config virtualenvs.create false

# Copy only the pyproject.toml and poetry.lock files to ensure proper layer caching
COPY pyproject.toml poetry.lock* /backend/

# Install project dependencies with Poetry
RUN poetry install --no-dev

# Copy the rest of the application source code
COPY . /backend/

# Set environment variables
ENV PYTHONPATH=/backend

# Run the application
CMD ["python", "/backend/main.py"]
