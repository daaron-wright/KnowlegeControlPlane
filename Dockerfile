# Use Node.js 18 Alpine
FROM node:18-alpine

# Install build dependencies
WORKDIR /app

# Install packages needed for building native modules
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]