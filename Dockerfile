# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp and other native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY omnis-ui/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the application source
COPY omnis-ui/ .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
