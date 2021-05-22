const faker = require('faker');
const { random, times } = require('lodash');

module.exports = {
  //TODO: fix the script to account for the recent db updates and take care of constraint collision so that anyone can run it comfortably for any number of records
  mockAll: async (noOfRecords, models, getCryptoRandom) => {
    try {
      console.log('info', 'begin seeding with mock values for the database');

      await models.user.bulkCreate(
        times(noOfRecords, () => ({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          bio: faker.lorem.sentence(),
          emailId: faker.internet.email(),
          password: faker.internet.password(),
          dob: faker.date.past(),
          profilePictureUrl: faker.image.imageUrl(),
        })),
        { individualHooks: true },
      );
      console.log('info', `completed seeding users table for ${noOfRecords} records`);

      await models.listing.bulkCreate(
        times(noOfRecords, () => ({
          listingName: faker.company.companyName(),
          userId: getCryptoRandom(),
          pricePerDay: random(1000, 10000),
          miscCostPercentage: random(1, 10),
          address: faker.address.streetAddress(),
          description: faker.lorem.sentence(),
          cityId: random(1, noOfRecords),
          avgRating: random(1, 5),
          features: {
            typeofListing: 'private room',
            bedrooms: random(1, 5),
            bathrooms: random(1, 5),
            beds: random(1, 5),
            maxOccupants: random(1, 5),
            policies: {},
            amenities: {},
          },
        })),
        { individualHooks: true }, // allows the beforeCreate hook defined on the model file to run | which normally doesn't run for bulkCreate
      );
      console.log('info', `completed seeding listings table for ${noOfRecords} records`);

      let imageBulkArray = [];
      for (let i = 0; i < noOfRecords; i++) {
        let listingId = getCryptoRandom();
        let temp = times(5, () => ({
          listingId,
          url: faker.image.imageUrl(),
          metadata: {
            pos: random(1, 5),
            alignment: ['center', 'left', 'right', 'top', 'bottom'][random(0, 4)],
          },
        }));
        imageBulkArray.push(...temp);
      }
      await models.image.bulkCreate(imageBulkArray);

      console.log('info', `completed seeding images table for ${noOfRecords} records`);

      await models.bookmark.bulkCreate(
        times(noOfRecords, () => ({
          listingId: getCryptoRandom(),
          userId: getCryptoRandom(),
        })),
      );

      console.log('info', `completed seeding bookmarks table for ${noOfRecords} records`);

      await models.booking.bulkCreate(
        times(noOfRecords, () => {
          let currDate = faker.date.recent();
          let futureDate = new Date();
          futureDate.setDate(currDate.getDate() + random(4, 10));
          return {
            userId: getCryptoRandom(),
            listingId: getCryptoRandom(),
            paymentId: random(1, noOfRecords),
            checkInDate: currDate,
            checkOutDate: futureDate,
            totalPrice: random(1000, 10000),
          };
        }),
        { individualHooks: true },
      );

      console.log('info', `completed seeding bookings table for ${noOfRecords} records`);

      await models.review.bulkCreate(
        times(noOfRecords, () => ({
          bookingId: getCryptoRandom(),
          description: faker.lorem.sentence(),
          rating: random(1, 5, true),
          userId: getCryptoRandom(),
          byHost: [true, false][random(0, 1)],
        })),
      );
      console.log('info', `completed seeding reviews table for ${noOfRecords} records`);

      await models.payment.bulkCreate(
        times(noOfRecords, () => ({
          bookingId: getCryptoRandom(),
          transactionId: faker.datatype.uuid(),
          amount: random(1000, 10000),
        })),
      );
      console.log('info', `completed seeding payments table for ${noOfRecords} records`);
    } catch (err) {
      console.log('error', 'failed to seed the db with mock values', err);
    }
  },
};
