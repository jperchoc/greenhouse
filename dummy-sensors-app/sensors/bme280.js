import { getRandom, getRandomInt } from "../helpers/helper.js";

export default class BME280 {
    constructor(gpio, name) {
        this.gpio = gpio;
        this.name = name;

        this.temperature = getRandom(12, 25);
        this.dummyTemperature = {
            min: 5,
            max: 35,
            sens: 1,
            inc: getRandom(0, 0.25)
        };

        this.humidity = getRandom(0, 100);
        this.dummyHumidity = {
            min: 0,
            max: 100,
            sens: 1,
            inc: getRandom(0,1)
        };

        this.pressure = getRandom(1000, 1030);
        this.dummyPressure = {
            min: 990,
            max: 1042,
            sens: 1,
            inc: getRandom(0,1)
        };
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
        this.dummyTemperature.inc = getRandom(0, 0.25);
        this.dummyTemperature.sens = (getRandomInt(0, 100) > 50) ? this.dummyTemperature.sens : -this.dummyTemperature.sens;
        this.temperature = this.temperature + this.dummyTemperature.sens * this.dummyTemperature.inc;
        this.temperature = Math.min(this.dummyTemperature.max, this.temperature);
        this.temperature = Math.max(this.dummyTemperature.min, this.temperature);
    }
    updateDummyPressureValue() {
        this.dummyTemperature.inc = getRandom(0, 0.25);
        this.dummyTemperature.sens = (getRandomInt(0, 100) > 50) ? this.dummyTemperature.sens : -this.dummyTemperature.sens;
        this.temperature = this.temperature + this.dummyTemperature.sens * this.dummyTemperature.inc;
        this.temperature = Math.min(this.dummyTemperature.max, this.temperature);
        this.temperature = Math.max(this.dummyTemperature.min, this.temperature);
    }
}