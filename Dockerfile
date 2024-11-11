# Stage 1: Build the application
FROM node:18 as build-stage

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vue.js app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine as production-stage

# Copy the build output from the previous stage to the Nginx html directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx as the default command
CMD ["nginx", "-g", "daemon off;"]
