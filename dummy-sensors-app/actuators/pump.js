export default class Pump {
    constructor(gpio, name, onThreshold, offThreshold) {
        this.gpio = gpio;
        this.name = name;
        this.onThreshold = onThreshold;
        this.offThreshold = offThreshold;
        this.isOn = true;
    }
    on() {
        if (!this.isOn) {
            this.isOn = true;
            console.log('switch on pump ' + this.name);
        }
    }
    off() {
        if (this.isOn) {
            this.isOn = false;
            console.log('switch off lights ' + this.name);
        }
    }
};
    