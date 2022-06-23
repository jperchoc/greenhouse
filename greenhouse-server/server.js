import GreenhhouseWindow from "./actuators/greenhouse_window.js";
import LEDs from "./actuators/led.js";
import Pump from "./actuators/pump.js";
import { influxWrite, initInflux } from "./helpers/api.js";
import AmbiantSensor from "./sensors/ambiantSensor.js";
import HumiditySensor from "./sensors/humiditySensor.js";
import LightSensor from "./sensors/lightSensor.js";
import fetch from 'node-fetch';
import {config} from "./config.js";
import { isTimeAfter, isTimeBefore } from "./helpers/date.js";

//init db connection
const influx = initInflux();

//create sensors devices
const lightSensors = config.sensors.lightSensors.map(sensorConf => new LightSensor(sensorConf));
const ambiantSensors = config.sensors.ambiantSensors.map(sensorConf => new AmbiantSensor(sensorConf));
const humiditySensors = config.sensors.humiditySensors.map(sensorConf => new HumiditySensor(sensorConf));
//create actuators devices
const windowActuators = config.actuators.windows.map(actuatorConf => new GreenhhouseWindow(actuatorConf));
const lightActuators = config.actuators.lights.map(actuatorConf => new LEDs(actuatorConf));
const pumpActuators = config.actuators.pumps.map(actuatorConf => new Pump(actuatorConf));

//set default sunrise and sunset values
let sunrise = new Date('2022-06-19T05:56:35+00:00');
let sunset = new Date('2022-06-19T18:06:09+00:00');

//FUNCTIONS
const initSensors = async () => {
    for await (const lightSensor of lightSensors) { lightSensor.init()};
    for await (const ambiantSensor of ambiantSensors) { ambiantSensor.init()};
    for await (const humiditySensor of humiditySensors) { humiditySensor.init()};
}

const getSensorsData = async () =>  {
    for await (const lightSensor of lightSensors) { lightSensor.getSensorData()};
    for await (const ambiantSensor of ambiantSensors) { ambiantSensor.getSensorData()};
    for await (const humiditySensor of humiditySensors) { humiditySensor.getSensorData()};
}

const automateActuators = () => {
    //loop constants
    const now = new Date();
    const isDayTime = isTimeAfter(now, sunrise) && isTimeBefore(now, sunset);
    //TODO

    // //WINDOW
    // if (air_humidity > greenhouseWindow.openThreshold) {
    //     greenhouseWindow.open();
    // }
    // if (air_humidity < greenhouseWindow.closeThreshold) {
    //     greenhouseWindow.close();
    // }
    // //LEDS
    // if (lightValue < leds.onThreshold && !leds.isOn && isDayTime) {
    //     leds.on();
    // }
    // if (lightValue > leds.offThreshold && leds.isOn) {
    //     leds.off();
    // }
    // //PUMPS
    // if (!pump1.isOn && (humidity_1_value < pump1.onThreshold || humidity_1_value < pump1.onThreshold)) {
    //     pump1.on();
    // }
    // if (pump1.isOn && (humidity_1_value > pump1.offThreshold && humidity_2_value > pump1.offThreshold)) {
    //     pump1.off();
    // }

    // if (!pump2.isOn && (humidity_3_value < pump2.onThreshold || humidity_4_value < pump2.onThreshold)) {
    //     pump2.on();
    // }
    // if (pump2.isOn && (humidity_3_value > pump2.offThreshold && humidity_4_value > pump2.offThreshold)) {
    //     pump2.off();
    // }
}

const writeToDB = () => {
    const datas = [];
    //sensors
    lightSensors.forEach(lightSensor => {
        datas.push({measurement: 'light', tags: { name : lightSensor.name }, fields: { value: lightSensor.getLux()} });
    });
    ambiantSensors.forEach(ambiantSensor => {
        datas.push({measurement: 'air_temperature', tags: { name : ambiantSensor.name }, fields: { value: ambiantSensor.getTemperature()} });
        datas.push({measurement: 'air_humidity', tags: { name : ambiantSensor.name }, fields: { value: ambiantSensor.getHumidity()} });
        datas.push({measurement: 'air_pressure', tags: { name : ambiantSensor.name }, fields: { value: ambiantSensor.getPressure()} });
    });
    humiditySensors.forEach(humiditySensor => {
        datas.push({measurement: 'soil_humidity', tags: { name : humiditySensor.name }, fields: { value: humiditySensor.getHumidity()} });
    });
    //actuators
    windowActuators.forEach(windowActuator => {
        datas.push({measurement: 'window', tags: { name : windowActuator.name }, fields: { value: windowActuator.isOpen ? 1 : 0 } });
    });
    lightActuators.forEach(lightActuator => {
        datas.push({measurement: 'led', tags: { name : lightActuator.name }, fields: { value: lightActuator.isOn ? 1 : 0 } });
    });
    pumpActuators.forEach(pumpActuator => {
        datas.push({measurement: 'pump', tags: { name : pumpActuator.name }, fields: { value: pumpActuator.isOn ? 1 : 0 } });
    });
    //log to console
    console.log(formatData(datas));
    //Write datas
    influxWrite(influx, datas);
}


const getSunset = async () => {
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${config.lat}&lng=${config.lat}&date=today&formatted=0`);
    const json = await response.json();
    sunrise = new Date(json.results.sunrise);
    sunset = new Date(json.results.sunset);
}

const formatData = (datas) => {
    let formatted = '======= DATA ========';
    datas.forEach((data, i) => {
        formatted += `\n${data.measurement} (${data.tags.name}: ${data.fields.value})`;
    })
    return formatted;
}

//Script start
await initSensors();
await getSunset();
await getSensorsData();


//LOOPS

//refresh sunset and sunrise values every 12 hours
setInterval(async () => {
    await getSunset();
}, 1000 * 60 * 60 * 12);


setInterval(async () => {
    //update sensors
    await getSensorsData();
    
    //automatisation
    automateActuators();    

    //Write to influxDB
    writeToDB();

}, config.interval);