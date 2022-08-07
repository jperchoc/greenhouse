FROM node:18

EXPOSE 8080

ENV PATH="$PATH:/opt/vc/bin"

RUN echo "/opt/vc/lib" > /etc/ld.so.conf.d/00-vcms.conf


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV API_PORT 8080
ENV USE_INLFUX true
ENV INFLUX_HOST 0.0.0.0
ENV INFLUX_PORT 8086
ENV INFLUX_DB_NAME greenhouse_real_data
ENV LAT 0
ENV LONG 0
ENV INTERVAL 1000
ENV CAMERA_COMMAND /opt/vc/bin/raspistill


CMD [ "ldconfig && node", "server.js" ]
