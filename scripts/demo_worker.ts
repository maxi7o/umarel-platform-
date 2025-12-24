
import { QueueService } from '../lib/queue/queue';
import { ModelWorker } from '../lib/queue/worker';
import { v4 as uuidv4 } from 'uuid';

async function runDemo() {
    console.log("🚀 Starting AI Worker Demo...");

    // 1. Create a Job (Race Strategy)
    const jobRace = {
        id: uuidv4(),
        type: 'marketing_copy' as const,
        payload: { input: "italian cooking class" },
        config: { strategy: 'race' as const },
        createdAt: Date.now()
    };

    console.log(`\n[1] Pushing RACE Job: ${jobRace.id}`);
    await QueueService.addJob(jobRace);

    // 2. Process it
    const poppedJob = await QueueService.popJob();
    if (poppedJob) {
        await ModelWorker.processJob(poppedJob);

        // 3. Check Result
        const result = await QueueService.getJobResult(poppedJob.id);
        console.log("✅ Result:", result);
    }

    // 4. Create a Job (Best of 3)
    const jobBest = {
        id: uuidv4(),
        type: 'marketing_copy' as const,
        payload: { input: "bike tour" },
        config: { strategy: 'best_of_n' as const, iterations: 3 },
        createdAt: Date.now()
    };

    console.log(`\n[2] Pushing BEST_OF_3 Job: ${jobBest.id}`);
    await QueueService.addJob(jobBest);

    // 5. Process it
    const poppedJob2 = await QueueService.popJob();
    if (poppedJob2) {
        await ModelWorker.processJob(poppedJob2);

        const result2 = await QueueService.getJobResult(poppedJob2.id);
        console.log("✅ Result (Array of 3):", Array.isArray(result2) ? `Got ${result2.length} results` : result2);
    }

    process.exit(0);
}

runDemo();
