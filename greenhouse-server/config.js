export const config = {
    useInfluxDB: false,
    host: 'youInfluxDBHostHere',
    port: '8086',
    db: 'greenhouse_real_data',
    lat: '0.00',
    long: '0.00',
    interval: 1000,
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
                dryValue: 1023,
                wetValue: 730,
            },
            {
                name: 'humidity_sensor_2',
                channel: 1,
                speedHz: 1350000,
                dryValue: 1023,
                wetValue: 730,
            },
            {
                name: 'humidity_sensor_3',
                channel: 2,
                speedHz: 1350000,
                dryValue: 1023,
                wetValue: 720,
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