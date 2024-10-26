import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Cron, ScheduleModule } from '@nestjs/schedule';

@Injectable()
class CronService {
	private messagePromises = Array(5).fill(null);
	private runs = 0;

	// Function that returns a promise which prints the message
	private async getMessage(
		run: number,
		index: number,
		delay: number
	): Promise<string> {
		return new Promise((resolve, reject) => {
			// Simulate async operation with a timeout
			setTimeout(() => {
				resolve(`${index} I'm running ${run}`);
				if (index === 0) {
					console.log('deu erro');
					reject('err');
				}
			}, delay); // 1-second delay
		});
	}

	@Cron('* * * * * *') // Runs every second
	async handleCron() {
		this.runs += 1;
		const currentRun = this.runs.valueOf();
		console.log(`Starting run: ${this.runs}`);

		// Execute each promise in the array
		await Promise.allSettled(
			this.messagePromises.map(async (_, index) => {
				const message = await this.getMessage(
					currentRun,
					index,
					5000 * (index + 1)
				);
				console.log(message);
			})
		);
	}
}

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService]
})
class AppModule {}

async function bootstrap() {
	await NestFactory.createApplicationContext(AppModule);
}

bootstrap();
