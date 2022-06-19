import GreenhhouseWindow from "./actuators/greenhouse_window.js";
import LEDs from "./actuators/led.js";
import Pump from "./actuators/pump.js";
import { influxWrite, initInflux } from "./helpers/api.js";
import BME280 from "./sensors/bme280.js";
import HumiditySensor from "./sensors/humidity.js";
import LightSensor from "./sensors/lightSensor.js";

const INTERVAL = 1000;
const influx = initInflux();

const humiditySensors = [
    new HumiditySensor(0, 'sensor_1'),
    new HumiditySensor(0, 'sensor_2'),
    new HumiditySensor(0, 'sensor_3'),
    new HumiditySensor(0, 'sensor_4')
];
const lightSensor = new LightSensor(0, 'greenhouse_light');
const bme280 = new BME280(0, 'greenhouse_air');

const greenhouseWindow = new GreenhhouseWindow(0, 'window', 80, 40);
const leds = new LEDs(0, 'leds', 1000, 4000);
const pump1 = new Pump(0, 'pump_1', 30, 60);
const pump2 = new Pump(0, 'pump_2', 30, 60);

greenhouseWindow.close();
leds.off();
pump1.off();
pump2.off();

setInterval(() => {
    //compute dummy sensors data
    lightSensor.updateDummyValue(leds);
    humiditySensors[0].updateDummyValue(pump1);
    humiditySensors[1].updateDummyValue(pump1);
    humiditySensors[2].updateDummyValue(pump2);
    humiditySensors[3].updateDummyValue(pump2);
    bme280.updateDummyTemperatureValue();
    bme280.updateDummyHumidityValue(greenhouseWindow);
    bme280.updateDummyPressureValue();

    //Get sensors values
    const humidity_1_value = humiditySensors[0].getValue();
    const humidity_2_value = humiditySensors[1].getValue();
    const humidity_3_value = humiditySensors[2].getValue();
    const humidity_4_value = humiditySensors[3].getValue();
    const lightValue = lightSensor.getValue();
    const air_temperature = bme280.getTemperatureValue();
    const air_humidity = bme280.getHumidityValue();
    const air_pressure = bme280.getPressureValue();

    //automatisation
    //WINDOW
    if (air_humidity > greenhouseWindow.openThreshold) {
        greenhouseWindow.open();
    }
    if (air_humidity < greenhouseWindow.closeThreshold) {
        greenhouseWindow.close();
    }
    //LEDS

    const now = new Date();
    if (lightValue < leds.onThreshold && !leds.isOn && !(now.getHours() > 7 && now.getHours < 19)) {
        leds.on();
    }
    if (lightValue > leds.offThreshold && leds.isOn) {
        leds.off();
    }
    //PUMPS
    if (!pump1.isOn && (humidity_1_value < pump1.onThreshold || humidity_1_value < pump1.onThreshold)) {
        pump1.on();
    }
    if (pump1.isOn && (humidity_1_value > pump1.offThreshold && humidity_2_value > pump1.offThreshold)) {
        pump1.off();
    }

    if (!pump2.isOn && (humidity_3_value < pump2.onThreshold || humidity_4_value < pump2.onThreshold)) {
        pump2.on();
    }
    if (pump2.isOn && (humidity_3_value > pump2.offThreshold && humidity_4_value > pump2.offThreshold)) {
        pump2.off();
    }

    //Write to influxDB
    const datas = [
        {
            measurement: 'light',
            tags: { name: lightSensor.name },
            fields: { value: lightValue }
        },
        {
            measurement: 'soil_humidity',
            tags: { name: humiditySensors[0].name },
            fields: { value: humidity_1_value }
        },
        {
            measurement: 'soil_humidity',
            tags: { name: humiditySensors[1].name },
            fields: { value: humidity_2_value }
        },
        {
            measurement: 'soil_humidity',
            tags: { name: humiditySensors[2].name },
            fields: { value: humidity_3_value }
        },
        {
            measurement: 'soil_humidity',
            tags: { name: humiditySensors[3].name },
            fields: { value: humidity_4_value }
        },
        {
            measurement: 'air_temperature',
            tags: { name: bme280.name },
            fields: { value: air_temperature }
        },
        {
            measurement: 'air_humidity',
            tags: { name: bme280.name },
            fields: { value: air_humidity }
        },
        {
            measurement: 'air_pressure',
            tags: { name: bme280.name },
            fields: { value: air_pressure }
        },
        {
            measurement: 'pump',
            tags: { name: pump1.name },
            fields: { value: pump1.isOn ? 1 : 0 }
        },
        {
            measurement: 'pump',
            tags: { name: pump2.name },
            fields: { value: pump2.isOn ? 1 : 0 }
        },
        {
            measurement: 'led',
            tags: { name: leds.name },
            fields: { value: leds.isOn ? 1 : 0 }
        },
        {
            measurement: 'window',
            tags: { name: greenhouseWindow.name },
            fields: { value: greenhouseWindow.isOpen ? 1 : 0 }
        }
    ];
    console.log(datas);
    //Write datas
    influxWrite(influx, datas);

}, INTERVAL);