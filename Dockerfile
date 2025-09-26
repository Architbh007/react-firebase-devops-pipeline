# Production Environment only
FROM nginx:alpine AS production

# Add metadata for traceability
LABEL maintainer="DevOps Pipeline"
LABEL version="1.0"
LABEL description="React Firebase App - Production Runtime"

# Install curl for health checks
RUN apk --no-cache add curl

# Copy prebuilt React app from Jenkins build output
COPY build/ /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Add startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use non-root user for security
USER nginx

# Start nginx
CMD ["/docker-entrypoint.sh"]
