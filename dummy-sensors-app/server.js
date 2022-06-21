import GreenhhouseWindow from "./actuators/greenhouse_window.js";
import LEDs from "./actuators/led.js";
import Pump from "./actuators/pump.js";
import { influxWrite, initInflux } from "./helpers/api.js";
import BME280 from "./sensors/bme280.js";
import HumiditySensor from "./sensors/humidity.js";
import LightSensor from "./sensors/lightSensor.js";
import fetch from 'node-fetch';
import config from "./config.js";
import { isTimeAfter, isTimeBefore } from "./helpers/date.js";

const INTERVAL = 1000;
const influx = initInflux();

const humiditySensors = [
    new HumiditySensor(0, 'sensor_1'),
    new HumiditySensor(0, 'sensor_2'),
    new HumiditySensor(0, 'sensor_3'),
    new HumiditySensor(0, 'sensor_4')
];
const lightSensor = new LightSensor('greenhouse_light');
const bme280 = new BME280('greenhouse_air');

const greenhouseWindow = new GreenhhouseWindow(0, 'window', 80, 40);
const leds = new LEDs(0, 'leds', 1000, 4000);
const pump1 = new Pump(0, 'pump_1', 30, 60);
const pump2 = new Pump(0, 'pump_2', 30, 60);

let sunrise = new Date('2022-06-19T05:56:35+00:00');
let sunset = new Date('2022-06-19T18:06:09+00:00');

const formatData = (datas) => {
    let formatted = '======= DATA ========';
    datas.forEach((data, i) => {
        formatted += `\n${data.measurement} (${data.tags.name}: ${data.fields.value})`;
    })
    return formatted;
}

const getSunset = async () => {
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${config.lat}&lng=${config.lat}&date=today&formatted=0`);
    const json = await response.json();
    sunrise = new Date(json.results.sunrise);
    sunset = new Date(json.results.sunset);
}

await lightSensor.initSensor();
await getSunset();

setInterval(async () => {
    await getSunset();
}, 1000 * 60 * 60 * 24);

setInterval(async () => {
    //compute dummy sensors data
    const now = new Date();
    const isDayTime = isTimeAfter(now, sunrise) && isTimeBefore(now, sunset);

    await humiditySensors[0].getSensorData({isDummy: true, pump: pump1});
    await humiditySensors[1].getSensorData({isDummy: true, pump: pump1});
    await humiditySensors[2].getSensorData({isDummy: true, pump: pump2});
    await humiditySensors[3].getSensorData({isDummy: true, pump: pump2});
    await bme280.getSensorData({isDummy: true, ghWindow: greenhouseWindow});
    await lightSensor.getSensorData({isDummy: false, leds: leds, isDayTime: isDayTime});

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
    if (lightValue < leds.onThreshold && !leds.isOn && isDayTime) {
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
        { measurement: 'light', tags: { name: lightSensor.name }, fields: { value: lightValue }},
        // { measurement: 'soil_humidity', tags: { name: humiditySensors[0].name }, fields: { value: humidity_1_value }},
        // { measurement: 'soil_humidity', tags: { name: humiditySensors[1].name }, fields: { value: humidity_2_value }},
        // { measurement: 'soil_humidity', tags: { name: humiditySensors[2].name }, fields: { value: humidity_3_value }},
        // { measurement: 'soil_humidity', tags: { name: humiditySensors[3].name }, fields: { value: humidity_4_value }},
        // { measurement: 'air_temperature', tags: { name: bme280.name }, fields: { value: air_temperature }},
        // { measurement: 'air_humidity', tags: { name: bme280.name }, fields: { value: air_humidity }},
        // { measurement: 'air_pressure', tags: { name: bme280.name }, fields: { value: air_pressure }},
        // { measurement: 'pump', tags: { name: pump1.name }, fields: { value: pump1.isOn ? 1 : 0 }},
        // { measurement: 'pump', tags: { name: pump2.name }, fields: { value: pump2.isOn ? 1 : 0 }},
        // { measurement: 'led', tags: { name: leds.name }, fields: { value: leds.isOn ? 1 : 0 }},
        // { measurement: 'window', tags: { name: greenhouseWindow.name }, fields: { value: greenhouseWindow.isOpen ? 1 : 0 }}
    ];
    console.log(formatData(datas));
    //Write datas
    influxWrite(influx, datas);

}, INTERVAL);