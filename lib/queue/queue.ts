/**
 * AI Job Queue Service
 * Handles pushing jobs to Redis for the worker to pick up.
 */
import { redis } from './redis';

export type AIJobType = 'experience_suggestion' | 'dispute_analysis' | 'marketing_copy';

export interface AIJob {
    id: string;
    type: AIJobType;
    payload: any;
    config?: {
        models?: ('openai' | 'gemini')[];
        strategy?: 'race' | 'cheapest' | 'best_of_n';
        iterations?: number;
    };
    createdAt: number;
}

const QUEUE_KEY = 'ai_jobs_queue';
const RESULT_PREFIX = 'ai_job_result:';

export class QueueService {

    // Push a job to the queue
    static async addJob(job: AIJob) {
        // Linear queue for MVP (lpush/rpop)
        await redis.lpush(QUEUE_KEY, JSON.stringify(job));
        return job.id;
    }

    // Get a job (Worker uses this)
    static async popJob(): Promise<AIJob | null> {
        const result = await redis.rpop(QUEUE_KEY);
        return result ? JSON.parse(result) : null;
    }

    // Store Job Result
    static async completeJob(jobId: string, result: any) {
        // Expire results after 24 hours
        await redis.set(`${RESULT_PREFIX}${jobId}`, JSON.stringify(result), 'EX', 86400);
    }

    // Check Job Status
    static async getJobResult(jobId: string) {
        const result = await redis.get(`${RESULT_PREFIX}${jobId}`);
        return result ? JSON.parse(result) : null;
    }
}
