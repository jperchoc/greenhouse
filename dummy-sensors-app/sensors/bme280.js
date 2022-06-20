import { getRandom, getRandomInt } from "../helpers/helper.js";
import bme280 from 'bme280';

export default class BME280 {
    constructor(name) {
        this.name = name;
        this.temperature = getRandom(12, 25);
        this.humidity = getRandom(0, 100);
        this.pressure = getRandom(1000, 1030);
        this.dummyHumidity = {
            min: 0,
            max: 100,
            sens: 1,
            inc: getRandom(0,1)
        };
        this.dummyTemperature = {
            min: 5,
            max: 35,
            sens: 1,
            inc: getRandom(0, 0.25)
        };
        this.dummyPressure = {
            min: 990,
            max: 1042,
            sens: 1,
            inc: getRandom(0,1)
        };
    }

    async getSensorData(params) {
        if (params.isDummy) {
            this.updateDummyHumidityValue(params.ghWindow);
            this.updateDummyPressureValue();
            this.updateDummyTemperatureValue();
        } else {
            try {
                const sensor = await bme280.open();
                const sensorData = await sensor.read();
                this.temperature = sensorData.temperature;
                this.pressure = sensorData.pressure;
                this.humidity = sensorData.humidity;
            } catch (error) {
                console.log(error);
            }
        }
    }

    getTemperatureValue() {
        return this.temperature;
    }
    getHumidityValue() {
        return this.humidity;
    }
    getPressureValue() {
        return this.pressure;
    }

    updateDummyTemperatureValue() {
        this.dummyTemperature.inc = getRandom(0, 0.25);
        this.dummyTemperature.sens = (getRandomInt(0, 100) > 50) ? this.dummyTemperature.sens : -this.dummyTemperature.sens;
        this.temperature = this.temperature + this.dummyTemperature.sens * this.dummyTemperature.inc;
        this.temperature = Math.min(this.dummyTemperature.max, this.temperature);
        this.temperature = Math.max(this.dummyTemperature.min, this.temperature);
    }
    updateDummyHumidityValue(ghWindow) {
        this.dummyHumidity.inc = getRandom(0, 0.25);
        this.dummyHumidity.sens = ghWindow.isOpen ? -1 : 0.1;
        this.dummyHumidity.sens = (getRandomInt(0, 100) > 10) ? this.dummyHumidity.sens : -this.dummyHumidity.sens;
        this.humidity = this.humidity + this.dummyHumidity.sens * this.dummyHumidity.inc;
        this.humidity = Math.min(this.dummyHumidity.max, this.humidity);
        this.humidity = Math.max(this.dummyHumidity.min, this.humidity);
    }
    updateDummyPressureValue() {
        this.dummyPressure.inc = getRandom(0, 0.25);
        this.dummyPressure.sens = (getRandomInt(0, 100) > 50) ? this.dummyPressure.sens : -this.dummyPressure.sens;
        this.pressure = this.pressure + this.dummyPressure.sens * this.dummyPressure.inc;
        this.pressure = Math.min(this.dummyPressure.max, this.pressure);
        this.pressure = Math.max(this.dummyPressure.min, this.pressure);
    }
}