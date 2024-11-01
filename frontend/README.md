
# SagaHalla DApp Frontend

This project contains the frontend for the SagaHalla decentralized application (DApp), specifically implementing the `mana_gov` and `victory` apps.

## Table of Contents

- [SagaHalla DApp Frontend](#sagahalla-dapp-frontend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Folder Structure](#folder-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Docker Support](#docker-support)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This project is a React/Next.js application that includes two main apps:

- **Mana Gov**: Manages governance operations.
- **Victory Exchange**: Facilitates exchanges and interactions.

## Folder Structure

```plaintext
.
├── app
│   ├── components         # Reusable UI components
│   ├── mana_gov           # Mana governance app logic
│   ├── victory            # Victory exchange app logic
│   ├── saga_gpt           # Additional functionalities for SagaHalla
│   ├── wallet_components  # Wallet connection and management
│   ├── wagmi.ts           # Wagmi library configuration for blockchain interaction
│   └── page.tsx           # Main page layout
├── components             # Higher-level reusable blocks and UI components
├── config                 # Configuration files (e.g., `tools.json`)
├── lib                    # Shared utility functions and modules
├── public                 # Public assets (e.g., images)
├── prisma                 # Database schema for backend interaction
├── sagahalla-wallet       # Wallet configurations for NEAR testnet
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── Dockerfile             # Docker configuration
```

## Installation

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/) installed.

### Steps

1. Clone the repository:

    ```bash
    git clone <repository_url>
    cd sagahalla-dapp/frontend
    ```
  
2. Install dependencies:
   
    ```bash
    npm install
    ```

## Configuration

1. **Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Configure your environment variables as needed (e.g., `DATABASE_URL`, `MODEL_PROVIDER`).
2. **Docker**:
   - This project includes a `Dockerfile` for containerized deployment.

## Running the Application

### Development Mode

To run the application locally in development mode, use:

```bash
npm run dev
```

### Production Mode

For production builds, use:

```bash
npm run build
npm run start
```

### Docker Support

To build and run the application in a Docker container:

```bash
docker build -t sagahalla-frontend .
docker run -p 3000:3000 sagahalla-frontend
```

## Technologies Used

- **React** & **Next.js**: Core frontend framework.
- **TypeScript**: Type-safe JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **Wagmi**: Ethereum wallet library for blockchain interactions.
- **Prisma**: Database ORM.
- **Docker**: Containerization for deployment.

## Contributing

Feel free to contribute to this project! Please fork the repository and create a pull request for any features or bug fixes.

Note to Redacted Judges: Front-End is not integreated with the blockchain contracts as of the time of submission.  LIkewise proposal submission and voting interfaces are out of sync with the submission forms for validation.

## License

This project is licensed under the Apache License. See the [LICENSE](LICENSE) file for details.
