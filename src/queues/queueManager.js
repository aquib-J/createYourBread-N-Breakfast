const Queue = require('bull');
const { redis } = require('../config');

const { EmailService: Email, UtilityService: Utility } = require('../services');
const {
  constants: {
    emailJobTypes: { resetEmail, signupEmail, bookingCancellation, bookingConfirmation },
  },
} = require('../utils');

let redisConf = {
  redis: redis.config.url,
};

const EmailQueue = new Queue('email', redisConf);

const RatingAggregationQueue = new Queue('ratings', redisConf);

const ratingUpdateJob = RatingAggregationQueue.add({}, { repeat: { cron: '1 0 * * *' } }); // set some relevant payload data in the empty object

// function to create and enqueue email jobs 
const enqueueEmailJobs = async (type, data) => {
  const job = await EmailQueue.add(type, data, {
    retry: 2,
  });
  return job;
};

//  Consumers 

EmailQueue.process(resetEmail, Email.passwordResetEmail);
EmailQueue.process(signupEmail, Email.signupEmail);
EmailQueue.process(bookingConfirmation, Email.bookingConfirmationEmail);
EmailQueue.process(bookingCancellation, Email.bookingCancellationEmail);
RatingAggregationQueue.process('DailyListingUpdate', Utility.resetListingRatings);


// post consumption event publishers :

EmailQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});
RatingAggregationQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});



module.exports = { EmailQueue, RatingAggregationQueue, enqueueEmailJobs };
