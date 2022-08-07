import { InfluxDB } from "influx";
export const initInflux = () => {
    const host = process.env.INFLUX_HOST || '0.0.0.0';
    const port = process.env.INFLUX_PORT || 8086;
    const db = process.env.INFLUX_DB_NAME || 'greenhouse_real_data';
    return new InfluxDB(`http://${host}:${port}/${db}`);
};
export const influxWrite = async (influx, points) => {
    const useInfluxDB = JSON.parse(process.env.USE_INLFUX || true);
    if (useInfluxDB) {
        influx.writePoints(points);
    }
}

export default {
    influxWrite
}