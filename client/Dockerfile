FROM node:18.18.2-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .

#RUN npm ci --only=prod
# RUN npm ci --omit=dev
RUN npm ci

COPY . .

## uncomment for faster working
# RUN npm run build
# CMD ["npm", "run", "start"]

CMD ["npm", "run", "dev"]
