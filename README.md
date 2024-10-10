
# Saga Mana Dapp - Setup Guide

This guide will help you set up the **Saga Mana Dapp** project on your local machine.

## Prerequisites

Before starting, ensure you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone git@github.com:procept-partners/saga-mana-dapp.git
cd saga-mana-dapp
```

## 2. Set File Permissions (Important for Multi-Dev Environment)

Ensure proper file permissions for all developers working on the project. This step makes sure that all files are writable by the group on shared systems.

Run the following command in the project directory to make all files and directories group-writable:

```bash
chmod -R g+w ./backend ./frontend
```

If necessary, ensure your user is part of the `node` group:

```bash
sudo groupadd node  # Create the group if it doesn't exist
sudo usermod -aG node $(whoami)  # Add your user to the group
```

Then change the ownership of the directories:

```bash
sudo chown -R :node ./frontend
```

## 3. Build and Run the Project with Docker

Build and run the containers for both the backend and frontend services using Docker Compose:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for both the backend and frontend.
- Run the containers, with the backend available at `http://localhost:8000` and the frontend at `http://localhost:3000`.


### Useful Commands:

- **To stop the containers**:
  ```bash
  docker-compose down
  ```

- **To rebuild the containers** after making changes to the Dockerfiles:
  ```bash
  docker-compose up --build
  ```

## 4. Handling Common Git Issues

If you encounter permission errors when working with Git (e.g., during branch switching or file modifications), ensure you have the correct ownership of your local files:

```bash
sudo chown -R $(whoami) .
```

This command changes the ownership of all files in the project directory to your user.

### 5. Pulling and Pushing Changes

To avoid conflicts when pushing to the `main` branch, always pull the latest changes first:

```bash
git pull origin main
```

After resolving any conflicts (if any), you can push your changes:

```bash
git push origin main
```

---

With this setup, all developers should be able to collaborate seamlessly. If you encounter any issues, please check file permissions and ensure Docker is correctly installed.

## LlamaIndex

This project was bootstrapped with the [LlamaIndex](https://www.llamaindex.ai/) with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama). It is located in the app folder of the frontend and backend.

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex (Python features).
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript features).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!
