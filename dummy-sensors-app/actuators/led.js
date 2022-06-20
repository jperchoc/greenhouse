export default class LEDs {
    constructor(gpio, name, onThreshold, offThreshold) {
        this.gpio = gpio;
        this.name = name;
        this.onThreshold = onThreshold;
        this.offThreshold = offThreshold;
        this.isOn = false;
    }
    on() {
        if (!this.isOn) {
            this.isOn = true;
            console.log('switch on lights');
        }
    }
    off() {
        if (this.isOn) {
            this.isOn = false;
            console.log('switch off lights');
        }
    }
};
    