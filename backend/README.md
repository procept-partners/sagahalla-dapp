
# SagaHalla DApp Backend

This is the backend for the SagaHalla decentralized application (DApp), supporting governance, data management, and interaction with various APIs and services.

## Table of Contents

- [SagaHalla DApp Backend](#sagahalla-dapp-backend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Folder Structure](#folder-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Configuration](#configuration)
  - [Database Migration](#database-migration)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Docker Support](#docker-support)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

The backend provides API endpoints, agent configurations, and services that power the `mana_gov` governance operations. The backend is built with Python and is structured for easy extensibility and observability.

## Folder Structure

```plaintext
.
├── alembic                # Database migration scripts and configurations
│   ├── env.py
│   ├── script.py.mako
│   └── versions           # Auto-generated migration files
├── app                    # Core backend application files
│   ├── agents             # Agent-specific configurations
│   ├── api                # API routes and endpoint logic
│   ├── app.py             # Main application entry point
│   ├── config.py          # Configuration settings
│   ├── engine             # Logic for backend processing
│   ├── examples           # Example files and templates
│   ├── llmhub.py          # LLM (Large Language Model) integrations
│   ├── observability.py   # Observability configurations and monitoring
│   ├── settings.py        # Environment settings
│   └── utils.py           # Utility functions
├── config                 # Additional configuration files
│   ├── loaders.yaml       # YAML configuration for data loaders
│   └── tools.yaml         # YAML configuration for tools
├── mana_gov               # Governance-related modules and settings
│   ├── app.py
│   ├── hackathon_proposals # Proposal management
│   ├── models             # Database models
│   ├── routes             # API routes
│   ├── services           # Service layer logic
│   ├── settings.py
│   └── util               # Helper functions and utilities
├── storage                # Storage files (e.g., vector stores, graph stores)
├── main.py                # Main execution file
└── Dockerfile             # Docker configuration
```

## Installation

### Prerequisites

- Python 3.11+
- Docker (for containerization)

### Steps

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd sagahalla-dapp/backend
    ```
2. Install dependencies:
    ```bash
    poetry install
    ```

## Configuration

1. **Environment Variables**:
   - Copy `.env.example` to `.env`.
   - Update the `.env` file with relevant environment variables, such as `SQLALCHEMY_DATABASE_URL` and any API keys.
2. **Docker**:
   - This project includes a `Dockerfile` for containerized deployment.

## Database Migration

This project uses Alembic for database migrations.

1. **Generate a New Migration**:
    ```bash
    alembic revision --autogenerate -m "your migration message"
    ```
2. **Apply Migrations**:
    ```bash
    alembic upgrade head
    ```

## Running the Application

### Development Mode

To run the application locally in development mode:
```bash
poetry run python main.py
```

### Production Mode

For production, use a process manager like `gunicorn`:
```bash
gunicorn main:app --workers 4 --bind 0.0.0.0:8000
```

### Docker Support

To build and run the application in a Docker container:
```bash
docker build -t sagahalla-backend .
docker run -p 8000:8000 sagahalla-backend
```

## Technologies Used

- **Python**: Core programming language.
- **FastAPI**: Web framework for API development.
- **SQLAlchemy**: ORM for database interactions.
- **Alembic**: Database migration management.
- **Docker**: Containerization for consistent deployments.

## Contributing

Contributions are welcome! Fork the repository, make your changes, and create a pull request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
