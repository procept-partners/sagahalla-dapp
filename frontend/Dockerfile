# Frontend Dockerfile

# Stage 1: Build the application
FROM node:20-alpine as build

# Set working directory to /frontend to match the volume mount in docker-compose.yml
WORKDIR /frontend

# Install dependencies
COPY package.json package-lock.* ./
RUN npm install

# Copy the application source code and build the application
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine as release

# Set the working directory in the release stage
WORKDIR /frontend

# Copy the built application from the build stage
COPY --from=build /frontend /frontend

# Default command to start the frontend application
CMD ["npm", "run", "start"]

