FROM node:20.5.1
WORKDIR /app


COPY package*.json ./
RUN npm install bcrypt
RUN npm install

COPY . .
RUN npm run build
EXPOSE 8000

CMD ["npm", "run", "start"]
