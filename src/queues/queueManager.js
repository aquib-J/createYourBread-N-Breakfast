const Queue = require('bull');
const { redis } = require('../config');
const { Logger } = require('../utils');

const {
  constants: {
    emailJobTypes: { resetEmail, signupEmail, bookingCancellation, bookingConfirmation },
  },
} = require('../utils');

let redisConf = {
  redis: { host: redis.config.host },
};
let Email = require('../services/EmailService');
let Utility = require('../services/UtilityService');

class QueueM {
  constructor() {
    this.EmailQueue = new Queue('email', redisConf);
    this.RatingAggregationQueue = new Queue('ratings', redisConf);
  }

  // method to create and enqueue email jobs
  async enqueueEmailJobs(type, data) {
    const job = await this.EmailQueue.add(type, data, {
      retry: 2,
    });
    return job;
  }
  async getQueues() {
    return {
      EmailQueue: this.EmailQueue,
      RatingAggregationQueue: this.RatingAggregationQueue,
    };
  }

  async IntializeConsumersAndAttachEvents() {
    this.RatingAggregationQueue.add({}, { repeat: { cron: '1 0 * * *' } }), // set some relevant payload data in the empty object
      //Consumers;
    this.EmailQueue.process(resetEmail, Email.passwordResetEmail);
    this.EmailQueue.process(signupEmail, Email.signupEmail);
    this.EmailQueue.process(bookingConfirmation, Email.bookingConfirmationEmail);
    this.EmailQueue.process(bookingCancellation, Email.bookingCancellationEmail);
    this.RatingAggregationQueue.process('DailyListingUpdate', Utility.resetListingRatings);

    // post consumption event publishers :

    this.EmailQueue.on('completed', (job, result) => {
      Logger.log('info', `${JSON.stringify(job.name)} completed with result ${JSON.stringify(result.response)}`);
    });
    this.RatingAggregationQueue.on('completed', (job, result) => {
      Logger.log('info', `Job completed with result ${result}`);
    });
  }
}

module.exports = new QueueM();
