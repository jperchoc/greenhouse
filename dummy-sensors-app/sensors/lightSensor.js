import tsl2591 from 'tsl2591';

const LUX_DF = 762;

export default class LightSensor {
    constructor(config) {
        this.name = config.name;
        this.device = `/dev/i2c-${config.i2cBusNo}`;
        this.AGAIN = config.AGAIN;
        this.ATIME = config.ATIME;
        this.value = 0;
    }

    async init() {
        return new Promise((res, rej) => {
            this.sensor = new tsl2591({device:this.device});
            this.sensor.init({AGAIN: this.AGAIN, ATIME: this.ATIME}, err => {
                if(err) {
                    rej(err);
                } else {
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
                        this.value = (data.vis_ir - (2 * data.ir)) / ((this._getATimeValue() * this._getAGainValue()) / LUX_DF);
                        res();
                    }
                });
            } catch(e) {
                rej(e);
            }
        });
    }

    _getAGainValue() {
        switch (this.AGAIN) {
            case 0: return 1;
            case 1: return 25;
            case 2: return 428;
            case 3: return 9876;
            default: return 1;
        }
    }

    _getATimeValue() {
        return this.ATIME * 100 + 100;
    }

    async getSensorData() {
        try {
            return await this._readLuminosity();
        } catch(e) {
            console.log(e);
        }
    }

    getLux() {
        return this.value;
    }
}