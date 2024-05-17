FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npm install -g typescript
COPY . .
EXPOSE 3000
CMD npm run dev
