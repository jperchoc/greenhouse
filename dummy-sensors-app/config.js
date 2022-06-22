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
                //i2cAddress: 0x29, //TODO: find a way to change this
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
            // {
            //     name: 'humidity_sensor_1',
            //     channel: 0
            // },
            // {
            //     name: 'humidity_sensor_2',
            //     channel: 1
            // },
            // {
            //     name: 'humidity_sensor_3',
            //     channel: 2
            // },
            // {
            //     name: 'humidity_sensor_4',
            //     channel: 3
            // },
            // {
            //     name: 'humidity_sensor_5',
            //     channel: 4
            // }
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