# Use an official Node.js runtime as a parent image
FROM node:20.5.0

# Set the working directory to /app
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY frontend .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]