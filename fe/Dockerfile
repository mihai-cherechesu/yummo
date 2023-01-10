FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install

EXPOSE 3000
# CMD ["npm", "start"]
ENTRYPOINT ["/bin/sh"]

