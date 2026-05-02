FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy semua source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]