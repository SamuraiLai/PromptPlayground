FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple http server to serve the static files
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3000"] 