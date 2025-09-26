#!/bin/sh

# Docker entrypoint script for React Firebase App
echo "🚀 Starting React Firebase Application..."

# Print environment info
echo "📊 Environment Information:"
echo "- Container: $(hostname)"
echo "- User: $(whoami)"
echo "- Date: $(date)"
echo "- Nginx version: $(nginx -v 2>&1)"

# Check if build files exist
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ Error: Build files not found!"
    exit 1
fi

echo "✅ Build files verified"

# Test nginx configuration
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Error: Nginx configuration test failed!"
    exit 1
fi

echo "✅ Nginx configuration valid"

# Start nginx in foreground
echo "🌐 Starting Nginx web server..."
exec nginx -g 'daemon off;'