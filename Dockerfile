FROM node:14

WORKDIR /app

COPY package*.json ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "run"]
