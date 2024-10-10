# Stage 1: Build the application
FROM node:20 as build  

WORKDIR /frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the application source code and build the application
COPY . .  
RUN npm run build  

# Stage 2: Serve the application
FROM node:20 as release  

WORKDIR /frontend

# Copy the built application from the build stage
COPY --from=build /frontend/.next /frontend/.next
# Copy the public directory
COPY --from=build /frontend/public /frontend/public

# Set correct permissions for the frontend directory
RUN chown -R root:root /frontend

# Switch to the root user
USER root

# Default command to start a static server (modify based on your requirements)
CMD ["npx", "serve", "-s", ".next"]

