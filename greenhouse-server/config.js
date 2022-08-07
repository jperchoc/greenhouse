export const config = {

    sensors: {
        lightSensors: [
            {
                name: 'greenhouse_light',
                i2cBusNo: 1,
                i2cAddress: 0x29,
                AGAIN: 1,
                ATIME: 1,
            }
        ],
        ambiantSensors: [
            {
                name: 'greenhouse_ambiant',
                i2cBusNo: 1,
                i2cAddress: 0x76,
            }
        ],
        humiditySensors: [
            {
                name: 'humidity_sensor_1',
                channel: 0,
                speedHz: 1350000,
                dryValue: 839,
                wetValue: 410,
            },
            {
                name: 'humidity_sensor_2',
                channel: 1,
                speedHz: 1350000,
                dryValue: 832,
                wetValue: 406,
            },
            {
                name: 'humidity_sensor_3',
                channel: 2,
                speedHz: 1350000,
                dryValue: 814,
                wetValue: 400,
            },
            {
                name: 'humidity_sensor_4',
                channel: 3,
                speedHz: 1350000,
                dryValue: 826,
                wetValue: 404,
            },
        ]
    },
    actuators: {
        windows: [],
        lights: [],
        pumps: []
    }
}

export default {
    config
}
