#Dockerfile
FROM aarch64/alpine:latest 
RUN apk --update add nodejs  

ADD device-script/config.json config.json
ADD device-script/index.js index.js

ADD certs/ certs/

ADD device-script/node_modules/ node_modules

run ["node",  "-v"]

CMD ["npm", "start"]