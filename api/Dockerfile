# Specify a base image
FROM node:alpine
WORKDIR /backend

# Install some dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./
EXPOSE 4000

# Default Command
# CMD sets default command and/or parameters, which can be overwritten from command line when docker container runs.
# ENTRYPOINT command and parameters will not be overwritten from command line. Instead, all command line arguments will be added after ENTRYPOINT parameters.

CMD ["npm", "run", "start"]