FROM node:24-alpine
WORKDIR /usr/src/app

COPY borncamp_web/package*.json ./

RUN npm install

USER 1001
ADD --chown=1001:0 . .

EXPOSE 8080

CMD [ "node", "borncamp_web/app.js" ]
