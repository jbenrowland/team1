# Use the official Node.js image (adjust the version if needed)
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files separately to install dependencies first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app source code into the container
COPY . .

# Build the app (for production)
RUN npm run build

# Use a lightweight web server to serve the built files
# Use `serve` or `nginx` depending on your setup

# Option A: Use 'serve' to serve the build folder
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Option B: (alternative for advanced users using nginx)
# FROM nginx:alpine
# COPY --from=build-stage /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Expose port the app runs on
EXPOSE 3000

