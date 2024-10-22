# Frontend Dockerfile
FROM node:20

WORKDIR /frontend

# Install dependencies first
COPY package.json package-lock.json ./

# Add this before RUN npm ci
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

RUN npm ci

# Copy the rest of the application code
COPY . .

# Ensure the next.js binary is executable
RUN chmod +x /frontend/node_modules/.bin/next

# Expose port 3000 for Next.js development server
EXPOSE 3000

# Run the development server with live reloading
CMD ["npm", "run", "dev"]

