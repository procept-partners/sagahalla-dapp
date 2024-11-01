
# SagaHalla Dapp - Setup Guide

This guide will help you set up the **Saga Mana Dapp** project on your local machine. Whether you're a seasoned developer or new to Docker, this guide covers all the necessary steps to get you up and running.

## Prerequisites

Before starting, ensure you have the following tools installed on your local machine:

- [Docker](https://docs.docker.com/get-docker/): The main tool for running containers.
- [Docker Compose](https://docs.docker.com/compose/install/): Used to manage multi-container Docker applications.
- [Git](https://git-scm.com/): To clone and manage the project repository.

For beginners, you can check each tool’s official documentation for installation steps:

- **Docker**: [Get Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Docker Overview

Docker allows you to run applications in isolated environments called **containers**. For this project, you’ll run both the backend and frontend in their own containers. Docker Compose will manage these containers and ensure they communicate properly.

If you're new to Docker, here are a few terms you should know:
- **Image**: A snapshot of your application and its environment (like an app installer).
- **Container**: A running instance of an image (like an app running on your computer).
- **Dockerfile**: A file that contains the steps to create a Docker image.
- **docker-compose.yml**: A file that defines and manages multiple containers.

## 1. Clone the Repository

First, clone the project to your local machine using Git:

```bash
git clone git@github.com:procept-partners/saga-mana-dapp.git
cd saga-mana-dapp
```

This will download the project files to a folder called \`saga-mana-dapp\`.

## 2. Set File Permissions (Important for Multi-Developer Environments)

In multi-developer projects, it's important to ensure file permissions are correct. This step ensures that all files are group-writable, meaning any developer can modify them without permission issues.

Run this command to set group-writable permissions:

```bash
chmod -R g+w ./backend ./frontend
```

If you encounter any permission errors later, make sure the files and folders have the correct ownership by running:

```bash
sudo chown -R $(whoami) .
```

This ensures that you own the files on your machine.

## 3. Build and Run the Project with Docker

Now, let’s build and run the project using Docker Compose. This command will create and start the necessary Docker containers for both the backend and frontend:

```bash
docker-compose up --build
```

Here’s what this command does:

- **Builds the Docker images** based on the Dockerfiles for the backend and frontend.
- **Starts the containers**, with the backend accessible at \`http://localhost:8000\` and the frontend at \`http://localhost:3000\`.

### Accessing the App:
- **Backend API**: Open your browser and go to [http://localhost:8000](http://localhost:8000) to access the backend.
- **Frontend**: Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the frontend.

### Common Docker Commands:

- **Stop the containers**:
  
  ```bash
  docker-compose down
  ```

  This stops and removes the containers, networks, and volumes created by \`docker-compose up\`.

- **Rebuild the containers** after making changes to the Dockerfiles:
  
  ```bash
  docker-compose up --build
  ```

  This ensures that any updates in your Dockerfiles are included in the build.

- **Check container logs**:
  
  ```bash
  docker-compose logs
  ```

  This shows logs for both the backend and frontend containers, which can help troubleshoot any issues.

## 4. Common Issues and Troubleshooting

### 1. Permission Errors

If you encounter any permission errors during file edits, commits, or when switching branches in Git, ensure the correct ownership of files by running:

```bash
sudo chown -R $(whoami) .
```

This command changes ownership of all files in the current directory to your user.

### 2. Docker Cache

Sometimes Docker may use cached images instead of rebuilding the containers from scratch. If you suspect this is causing issues, you can force Docker to rebuild the images without using the cache:

```bash
docker-compose build --no-cache
```

### 3. Docker Compose Down Issues

If you get stuck or can't stop the containers properly, you can try running:

```bash
docker-compose down --volumes
```

This also removes any Docker volumes created during the \`up\` process, resetting the data stored in the containers.

## 5. Pulling and Pushing Changes

Always make sure your local repository is up-to-date before pushing changes to avoid conflicts:

```bash
git pull origin main
```

After making changes and resolving any conflicts, push your changes:

```bash
git push origin main
```

If you want to work on a new feature or fix a bug, it's a good idea to create a new branch:

```bash
git checkout -b feature/new-feature
```

When you're ready, push the branch and create a pull request for review.

---

## 6. Editing Files in a Running Container (VS Code)

If you want to edit the files inside the running Docker container using **Visual Studio Code**, follow these steps:

1. Install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VS Code.
2. Open VS Code and open your local project folder.
3. Attach to the running container by using the **Command Palette** (Ctrl+Shift+P) and typing:

   ```
   Remote-Containers: Attach to Running Container...
   ```

4. Select the running container related to your project (you should see something like `saga-mana-dapp_frontend` or `saga-mana-dapp_backend`).
5. Once connected, you can edit the files directly inside the container, and the changes will reflect on your local machine.

If you prefer to open the entire project in the container, you can use the following steps:

1. Open the **Command Palette** (Ctrl+Shift+P).
2. Select **Remote-Containers: Open Folder in Container...**.
3. Choose the folder you want to open (the project root).
4. VS Code will restart inside the container, and you can edit the files like you would on your local machine.

With this approach, you don’t need to restart the Docker container when editing code.

---

Feel free to reach out or open an issue on GitHub if you encounter anything unexpected!
