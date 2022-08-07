import express from 'express';
import Camera from './sensors/camera.js';
import cors from 'cors'

export default class GreenhouseAPI {
  constructor(sensors) {
    this.app = express();
    this.camera = new Camera();
    this.sensors = sensors;
    const apiPort = process.env.API_PORT || 8080;

    this.app.use(cors());

    this.app.get('/', (req,res, next) => {
      res.send('Hello World')
    });

    this.app.get('/camera', (req, res, next) => {
      res.send(`<img src="${this.camera.image}" />`);
    })

    this.app.get('/sensors', (req, res, next) => {
      const data = {
          sensors: []
      };
      this.sensors.lightSensors.forEach(lightSensor => {
          data.sensors.push({measurement: 'light', name : lightSensor.name , value: lightSensor.getLux() });
      });
      this.sensors.ambiantSensors.forEach(ambiantSensor => {
          data.sensors.push({measurement: 'air_temperature', name : ambiantSensor.name, value: ambiantSensor.getTemperature() });
          data.sensors.push({measurement: 'air_humidity',  name : ambiantSensor.name, value: ambiantSensor.getHumidity() });
          data.sensors.push({measurement: 'air_pressure', name : ambiantSensor.name, value: ambiantSensor.getPressure() });
      });
      this.sensors.humiditySensors.forEach(humiditySensor => {
          data.sensors.push({measurement: 'soil_humidity', name : humiditySensor.name, value: humiditySensor.getHumidity() });
      });
      res.json(data);
    });

    this.app.listen(apiPort, () =>
      console.log('Api started on port ' + apiPort)
    );
  }
}