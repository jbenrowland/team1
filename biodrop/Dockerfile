# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Install a simple web server to serve the build folder
RUN npm install -g serve

# Expose the port serve will listen on
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
