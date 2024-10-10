# Frontend Dockerfile

# Stage 1: Build the application
FROM node:20 as build  

WORKDIR /frontend

# Install dependencies
COPY package.json package-lock.* ./
RUN npm install

# Copy the application source code and build the application
COPY . .
RUN npm run build  

# Stage 2: Serve the application
FROM node:20 as release  

# Use existing node user (which has UID 1000 and GID 1000)
USER node

WORKDIR /frontend

# Copy the built application from the build stage
COPY --from=build /frontend /frontend

# Default command to start the frontend application in development mode
CMD ["npm", "run", "dev"]

