FROM node:14

WORKDIR /app

COPY package*.json ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "run"]
# CMD ["npm", "run", "build-frontend"]
# CMD ["npm", "run", "backend"]
# CMD ["npm", "run", "writeDB"]
