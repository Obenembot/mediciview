# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the React app using NGINX
FROM nginx:alpine

# Copy the build folder to NGINX's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the NGINX server
EXPOSE 80

# Start NGINX when the container runs
CMD ["nginx", "-g", "daemon off;"]