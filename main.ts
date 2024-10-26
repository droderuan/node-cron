import { CronJob } from './src';

// equivalent job using the "from" static method, providing parameters as an object
const job = CronJob.from({
	cronTime: '1 * * * * *',
	onTick: function () {
		console.log('You will see this message every second');
	},
	start: false
});

job.start();
