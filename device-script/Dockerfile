#Dockerfile
FROM resin/raspberrypi3-node:latest

ADD config.json config.json
ADD index.js index.js
ADD package.json package.json

ADD certs/ certs/

ADD node_modules/ node_modules


CMD ["npm", "start"]