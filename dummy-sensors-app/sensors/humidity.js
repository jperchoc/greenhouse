import { getRandom, getRandomInt } from "../helpers/helper.js";

export default class HumiditySensor {
    constructor(gpio, name) {
        this.gpio = gpio;
        this.name = name;
        this.min = 0;
        this.max = 100;
        this.dummy = {
            sens: 1,
            inc: Math.random()
        }
        this.value = getRandom(0, 100);
    }
    getValue() {
        return this.value;
    }

    async getSensorData(params) {
        if (params.isDummy) {
            this.updateDummyValue(params.pump);
        } else {
            //TODO: get sensor data
        }
    }

    updateDummyValue(pump) {
        this.dummy.inc = getRandom(0, 1);
        this.dummy.sens = pump.isOn ? 1 : -0.1;
        this.dummy.sens = (getRandomInt(0, 100) > 10) ? this.dummy.sens : -this.dummy.sens;
        this.value = this.value + this.dummy.sens * this.dummy.inc;
        this.value = Math.min(this.max, this.value);
        this.value = Math.max(this.min, this.value);
    }
}