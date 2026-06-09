FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Build Vite application
RUN npm run build

# Expose port
EXPOSE 8080

# Configure environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start server
CMD ["node", "server.js"]
