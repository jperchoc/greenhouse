import { getRandom, getRandomInt } from "../helpers/helper.js";
import tsl2591 from 'tsl2591';

export default class LightSensor {
    constructor(name) {
        this.name = name;
        this.min = 50;
        this.max = 10000;
        this.dummy = {
            sens: 1,
            inc: Math.random()
        }
        this.value = getRandom(50, 10000);

        this.isSensorReady = false;
    }

    initSensor() {
        return new Promise((res, rej) => {
            this.sensor = new tsl2591({device: '/dev/i2c-1'});
            this.sensor.init({AGAIN: 1, ATIME: 1}, err => {
                if(err) {
                    rej(err);
                } else {
                    this.isSensorReady = true;
                    res();
                }
            });
        });
    }
    _readLuminosity() {
        return new Promise((res, rej) => {
            try {
                this.sensor.readLuminosity((err, data) => {
                    if (err) {
                        rej(err);
                    } else {
                        this.value = data.vis_ir;
                        res();
                    }
                });
            } catch(e) {
                rej(e);
            }
        });
    }

    async getSensorData(params) {
        if (params.isDummy) {
            this.updateDummyValue(params.leds, params.isDuringSunTime);
        } else {
            try {
                if (!this.isSensorReady) {
                    await this.initSensor();
                }
                return await this._readLuminosity();
            } catch(e) {
                console.log(e);
            }
        }
    }

    getValue() {
        return this.value;
    }

    updateDummyValue(leds, isDuringSunTime) {
        this.dummy.inc = getRandom(0, 10);
        const now = new Date();
        this.dummy.sens = isDuringSunTime ? 1 : -1;
        this.dummy.sens = (getRandomInt(0, 100) > 40) ? this.dummy.sens : -this.dummy.sens;
        if (leds.isOn && this.previousLedsState === false) {
            this.value += 1000;
        }
        if (!leds.isOn && this.previousLedsState === true) {
            this.value -= 1000;
        }
        this.previousLedsState = leds.isOn;
        this.value = this.value + this.dummy.sens * this.dummy.inc;
        this.value = Math.min(this.max, this.value);
        this.value = Math.max(this.min, this.value);
    }
}