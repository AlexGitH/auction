FROM node:18.18.2-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm ci --only=prod

COPY . .

CMD ["npm", "start"]
