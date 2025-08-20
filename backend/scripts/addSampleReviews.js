import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Review from '../src/models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const addSampleReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get users and services
    const users = await User.find({ role: 'user' }).limit(10);
    const services = await Service.find();

    if (users.length === 0 || services.length === 0) {
      console.log('No users or services found');
      process.exit(1);
    }

    // Sample review comments
    const comments = [
      "Excellent service! Highly recommend.",
      "Great experience, will book again.",
      "Professional and relaxing atmosphere.",
      "Amazing staff and wonderful results.",
      "Perfect for stress relief and relaxation.",
      "Outstanding quality and attention to detail.",
      "Exceeded my expectations completely.",
      "Very satisfied with the service provided.",
      "Friendly staff and clean facilities.",
      "Best service I've experienced in the area.",
      "Incredible value for money.",
      "Therapeutic and rejuvenating experience.",
      "Skilled professionals who care about clients.",
      "Peaceful environment and excellent service.",
      "Would definitely recommend to friends."
    ];

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    const reviews = [];

    // Add 2-5 reviews per service
    for (const service of services) {
      const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews
      const serviceUsers = users.sort(() => 0.5 - Math.random()).slice(0, numReviews);

      for (const user of serviceUsers) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
        const comment = comments[Math.floor(Math.random() * comments.length)];

        try {
          const review = await Review.create({
            user: user._id,
            service: service._id,
            rating,
            comment
          });
          reviews.push(review);
        } catch (error) {
          // Skip duplicate reviews
          continue;
        }
      }
    }

    console.log(`Created ${reviews.length} sample reviews`);

    // Calculate average ratings per service
    for (const service of services) {
      const serviceReviews = reviews.filter(r => r.service.toString() === service._id.toString());
      if (serviceReviews.length > 0) {
        const avgRating = (serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length).toFixed(1);
        console.log(`${service.name}: ${avgRating} stars (${serviceReviews.length} reviews)`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample reviews:', error);
    process.exit(1);
  }
};

addSampleReviews();