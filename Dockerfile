# Multi-stage Dockerfile for High HD DevOps Pipeline
# Stage 1: Build Environment
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Add metadata for better traceability
LABEL maintainer="DevOps Pipeline"
LABEL version="1.0"
LABEL description="React Firebase App - Production Build"

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (include devDependencies so React can build)
RUN apk add --no-cache git   # install git if any package needs it
RUN npm ci --silent


# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Verify build was successful
RUN ls -la build/ && echo "✅ Build completed successfully"

# Stage 2: Production Environment
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk --no-cache add curl

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Add startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use non-root user for security
USER nginx

# Start nginx
CMD ["/docker-entrypoint.sh"]
