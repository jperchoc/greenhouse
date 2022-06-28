import mcpadc from 'mcp-spi-adc';
import { mapBetween } from '../helpers/helper.js';

export default class HumiditySensor {
    constructor(config) {
        this.channel = config.channel;
        this.speedHz = config.speedHz;
        this.name = config.name;
        this.dryValue = config.dryValue;
        this.wetValue = config.wetValue;
        this.value = 0;
    }

    async init() {
        return new Promise((res, rej) => {
            this.sensor = mcpadc.open(this.channel, {speedHz: this.speedHz}, err => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            });
        });
    }
    getHumidity() {
        return this.value;
    }

    async getSensorData(params) {
        return new Promise((res, rej) => {
            try {
                this.sensor.read((err, data) => {
                    if (err) {
                        rej(err);
                    } else {
                        const perc = 100 - mapBetween(data.rawValue, 0, 100, this.wetValue, this.dryValue);
                        this.value = Math.max(-10, Math.min(110, perc));
                        res();
                    }
                });
            } catch(e) {
                rej(e);
            }
        });
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