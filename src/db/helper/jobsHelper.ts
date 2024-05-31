import { CronJobData } from "../../interfaces/CronJobData";
import { db } from "../db";

export const dbAddJob = async (jobData: CronJobData) => {
    await db
        .push("/jobs[]", jobData)
        .catch(console.log);
};

export const dbGetJobs = async (): Promise<CronJobData[]> => {
    return await db.getObjectDefault<CronJobData[]>("/jobs", []);
};

export const dbDeleteJob = async (id: string) => {
    const index = await db.getIndex("/jobs", id).catch(console.error);
    await db.delete(`/jobs[${index}]`).catch(console.error);
};
