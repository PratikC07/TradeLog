# ---------------------------------------------------
# Stage 1: Build the Application
# ---------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies (use ci for exact version match from lockfile)
RUN npm ci

# Copy the rest of the application code
COPY . .


ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

# Build the application (Outputs to /app/dist)
RUN npm run build

# ---------------------------------------------------
# Stage 2: Serve with Nginx
# ---------------------------------------------------
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]