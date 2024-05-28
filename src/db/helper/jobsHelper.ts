import { db } from "../db"

export const setJob = async (jobData: CronJobData) => {
    await db
        .push("/jobs/", jobData)
        .catch(console.log)
}
