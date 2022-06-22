import BME280 from 'bme280-sensor';
export default class AmbiantSensor {
    constructor(config) {
        this.name = config.name;
        this.i2cBusNo = config.i2cBusNo;
        this.i2cAddress = config.i2cAddress;
        this.temperature = 0;
        this.humidity = 0;
        this.pressure = 0;
    }

    async init() {
        const options = {
            i2cBusNo   : this.i2cBusNo,
            i2cAddress : this.i2cAddress
          };
          this.sensor = new BME280(options);
          await this.sensor.init();
    }

    async getSensorData() {
        try {
            const sensorData = await this.sensor.readSensorData();
            this.temperature = sensorData.temperature_C;
            this.humidity = sensorData.humidity;
            this.pressure = sensorData.pressure_hPa;
        } catch (error) {
            console.log(error);
        }
    }

    getTemperature() {
        return this.temperature;
    }
    getHumidity() {
        return this.humidity;
    }
    getPressure() {
        return this.pressure;
    }
}