FROM node:20.18.1-alpine3.19 as builder
RUN apk update
RUN apk add --update bash

RUN apk add git
RUN npm install -g typescript


WORKDIR /tmp
ADD package.json /tmp/
ADD package-lock.json /tmp/

RUN npm ci

ADD . /code/
WORKDIR /code
RUN rm -rf node_modules
RUN cp -a /tmp/node_modules /code/node_modules
ENV NODE_OPTIONS --max_old_space_size=4096
RUN npm run build


FROM node:20.18.1-alpine3.19
RUN apk update
RUN apk add --update bash

WORKDIR /code
RUN npm init -y
RUN npm install express@4.21.2
RUN npm install compression
RUN npm install ua-parser-js
RUN npm install browser-capabilities@1.1.x
COPY --from=builder /code/express.js /code/express.js
COPY --from=builder /code/src /code/src
EXPOSE 8080
CMD ["node", "express.js"]