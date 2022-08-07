import TSL2591 from "../libs/tsl2591.js";

export default class LightSensor {
    constructor(config) {
        this.name = config.name;
        this.i2cBusNo = config.i2cBusNo;
        this.i2cAddress = config.i2cAddress;
        this.AGAIN = config.AGAIN;
        this.ATIME = config.ATIME;
        this.value = 0;
    }

    async init() {
        this.sensor = new TSL2591({i2cBusNo: this.i2cBusNo, i2cAddress: this.i2cAddress});
    }

    async getSensorData() {
        try {
            this.value = await this.sensor.getLux();
            return this.value;
        } catch(e) {
            console.log(e);
        }
    }

    getLux() {
        return this.value;
    }
}