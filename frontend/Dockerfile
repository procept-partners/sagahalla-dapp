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

# Add arguments for user and group IDs for consistency across environments
ARG USER_ID=1000
ARG GROUP_ID=1000

# Create a user and group with specified IDs
RUN groupadd -g $GROUP_ID devgroup && \
    useradd -m -u $USER_ID -g devgroup devuser

WORKDIR /frontend

# Ensure devuser owns the directory
RUN chown -R devuser:devgroup /frontend

# Copy the built application from the build stage
COPY --from=build /frontend /frontend

# Switch to the new user
USER devuser

# Default command to start the frontend application in development mode
CMD ["npm", "run", "dev"]
