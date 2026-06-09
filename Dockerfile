FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (including devDependencies like Vite)
RUN npm install

# Copy application source code
COPY . .

# Build Vite application
RUN npm run build

# Remove development dependencies to keep the container small
RUN npm prune --omit=dev

# Expose port
EXPOSE 8080

# Configure environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start server
CMD ["node", "server.js"]
