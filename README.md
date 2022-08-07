# greenhouse
Automatic greenhouse

sudo docker build -t "jperchoc/greenhouse-server" .
```
docker run \
--name=greenhouse \
--env=LD_LIBRARY_PATH=/opt/vc/lib \
# --env=API_PORT=8080 \
# --env=USE_INLFUX=true \
--env=INFLUX_HOST=0.0.0.0 \ #change for your influx host
# --env=INFLUX_PORT=8086 \
#--env=INFLUX_DB_NAME=greenhouse_real_data \
#--env=USE_INLFUX=true \
--env=LAT=0 \
--env=LONG=0 \
#--env=INTERVAL=1000 \
#--env=CAMERA_COMMAND=/opt/vc/bin/raspistill \
--volume=/opt/vc:/opt/vc \
--privileged \
--workdir=/usr/src/app \
-p 8080:8080 \
--restart=always \
--device /dev/vchiq:/dev/vchiq \
jperchoc/greenhouse-server:latest
```

change your sensors & actuors config in config.js file.

The script will start an api with the following endpoints:

- http://yourhost:8080/camera to get the current camera 
image
- http://yourhost:8080/sensors to get the current sensors values