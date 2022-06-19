export default class GreenhhouseWindow {
    constructor(gpio, name, openThreshold, closeThreshold) {
        this.gpio = gpio;
        this.name = name;
        this.openThreshold = openThreshold;
        this.closeThreshold = closeThreshold;
        this.isOpen = true;
    }
    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            console.log('opening window');
        }
    }
    close() {
        if (this.isOpen) {
            this.isOpen = false;
            console.log('closing window');
        }
    }
};
    