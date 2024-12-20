# Use an official Node.js runtime as the base image
FROM node:18.12.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm i react-scripts
# Copy the rest of the app's files to the working directory
COPY . .

RUN npm run build
RUN npm install -g serve

# Expose the port the app runs on 3765
EXPOSE 3765

# Start the app
CMD ["serve", "-s", "build", "--listen", "3765"]
