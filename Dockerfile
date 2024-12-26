FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json turbo.json tsconfig.json ./

COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install

# Generate prisma client
RUN npm run db:generate

# Build the project
RUN npm run Build

CMD ["npm", "run", "start-user-app"]