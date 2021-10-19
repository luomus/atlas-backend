FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev librsvg2-dev
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
USER node
CMD ["node", "/app/src/main/start.js"]
