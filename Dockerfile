FROM node:8-alpine
RUN apk update

RUN apk add --update bash

RUN apk add git
RUN npm i -g npm@5.6.0
RUN npm install -g --unsafe-perm bower polymer-cli gulp-cli


WORKDIR /tmp
ADD bower.json /tmp/
ADD package.json /tmp/

RUN npm install
RUN bower --allow-root install

RUN mkdir /code/
ADD . /code/

# remove installed modules for clean setup
RUN rm -rf /code/build/
RUN rm -rf /code/node_modules/
RUN rm -rf /code/bower_modules/

WORKDIR /code
RUN mv /tmp/node_modules /code/node_modules
RUN mv /tmp/bower_components /code/bower_components
RUN gulp
EXPOSE 8080
CMD ["node", "express.js"]
