import { InfluxDB } from "influx";
import { config } from '../config.js';
export const initInflux = () => {
    return new InfluxDB(`http://${config.host}:${config.port}/${config.db}`);
};
export const influxWrite = async (influx, points) => {
    if (config.useInfluxDB) {
        influx.writePoints(points);
    }
}

export default {
    influxWrite
}