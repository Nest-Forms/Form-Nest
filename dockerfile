# Use an official Node.js runtime as a parent image
FROM node:21.4.0

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]