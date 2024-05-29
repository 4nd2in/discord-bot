export interface CronJobData {
    id: string,
    data: {
        cronTime: string,
        onTick: () => void,
        start: boolean
    }
}
