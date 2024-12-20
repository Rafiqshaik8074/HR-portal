# Use a suitable Node.js base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies and rebuilding bcrypt
RUN npm install -g npm@latest
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the necessary port
EXPOSE 8765

# Start the application. 
CMD ["npm", "start"]
