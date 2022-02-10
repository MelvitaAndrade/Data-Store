# Using Node:14 Image Since it contains all 
# the required build tools for dependencies with native build 
# First Stage : Install dependences and build application

FROM node:lts-alpine AS development
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build

# Second Stage : Setup application with Alpine node image
FROM node:lts-alpine
ARG SERVER_PORT=3002
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --only=production --ignore-scripts
COPY --from=development /app/dist ./dist
COPY --from=development /app/config ./config
EXPOSE $SERVER_PORT
CMD ["npm", "run", "start:prod"]