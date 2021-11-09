FROM node:14-slim
ENV NODE_ENV=production
WORKDIR /opt/app
RUN apt-get update && \
    apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev librsvg2-dev
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
COPY --chown=node . .
EXPOSE 3000
USER node
<<<<<<< HEAD
CMD ["node", "/app/src/main/start.js"]
=======
CMD ["node", "/opt/app/src/main/start.js"]
>>>>>>> map-service
