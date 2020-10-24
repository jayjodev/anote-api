# Specify a base image
FROM node:alpine
WORKDIR /server

# Install some dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000

# Default Command
CMD ["npm", "start"]