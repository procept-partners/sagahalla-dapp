# Frontend Dockerfile

# Stage 1: Build the application
FROM node:20 as build  

WORKDIR /frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application source code and build the application
COPY . .  # Copy all files from the current working directory (frontend)
RUN npm run build  

# Stage 2: Serve the application
FROM node:20 as release  

WORKDIR /frontend

# Copy the built application from the build stage
COPY --from=build /frontend /frontend

# Ensure the `.next` directory exists and has correct permissions
RUN mkdir -p /frontend/.next && chown -R root:root /frontend/.next

# Switch to the root user
USER root

# Default command to start the frontend application in development mode
CMD ["npm", "run", "dev"]
