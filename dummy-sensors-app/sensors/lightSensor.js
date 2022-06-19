import { getRandom, getRandomInt } from "../helpers/helper.js";

export default class LightSensor {
    constructor(gpio, name) {
        this.gpio = gpio;
        this.name = name;
        this.min = 50;
        this.max = 10000;
        this.dummy = {
            sens: 1,
            inc: Math.random()
        }
        this.value = getRandom(0, 100);
    }
    getValue() {
        return this.value;
    }

    updateDummyValue(leds) {
        this.dummy.inc = getRandom(0, 10);
        const now = new Date();
        this.dummy.sens = (now.getHours() > 7 && now.getHours < 19) ? 1 : -1;
        this.dummy.sens = (getRandomInt(0, 100) < 10) ? this.dummy.sens : -this.dummy.sens;
        if (leds.isOn && this.previousLedsState !== leds.isOn) {
            this.value += 1000;
        }
        if (!leds.isOn && this.previousLedsState !== leds.isOn) {
            this.value -= 1000;
        }
        this.previousLedsState = leds.isOn;
        this.value = this.value + this.dummy.sens * this.dummy.inc;
        this.value = Math.min(this.max, this.value);
        this.value = Math.max(this.min, this.value);
    }
}