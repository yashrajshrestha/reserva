# Stage 1: Build stage
FROM node:16.4.2-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies using `npm ci` for better dependency resolution
RUN npm ci --only=production

# Copy only necessary files for building
COPY . .

# Run any build processes if needed (e.g., transpilation, webpack)
# Example: RUN npm run build

# Stage 2: Final stage
FROM node:16.4.2-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy built files and dependencies from the previous stage
COPY --from=builder /app .

# Set permissions for node_modules directory
RUN chown -R node:node /app/node_modules && chmod -R 755 /app/node_modules

# Switch to a non-root user for better security
USER node

# Specify the default command to run the application
CMD ["npm", "run", "start"]