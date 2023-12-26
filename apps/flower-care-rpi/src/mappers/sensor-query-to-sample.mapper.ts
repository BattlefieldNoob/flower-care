import { SensorSample } from "@flower-care/libs/data-models"
import { SensorQueryResult } from "../models/sensor-data-query-result.type"

export const queryToSensorSampleMapper = (query: SensorQueryResult): SensorSample => {
    return {
        temperature: query.sensorValues.temperature,
        sunlight: query.sensorValues.lux,
        moisture: query.sensorValues.moisture,
        fertility: query.sensorValues.fertility,
        battery: query.firmwareInfo.battery,
        ts: new Date().toISOString()
    }
}
