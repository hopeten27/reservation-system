import mongoose from 'mongoose';
import Coupon from '../src/models/Coupon.js';
import dotenv from 'dotenv';

dotenv.config();

const createSampleCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    const coupons = [
      {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        minAmount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 100
      },
      {
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        minAmount: 50,
        maxDiscount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 50
      },
      {
        code: 'FIRST15',
        type: 'percentage',
        value: 15,
        minAmount: 30,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 200
      },
      {
        code: 'FIXED25',
        type: 'fixed',
        value: 25,
        minAmount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 30
      }
    ];

    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`Created ${createdCoupons.length} sample coupons:`);
    
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.value}${coupon.type === 'percentage' ? '%' : '$'} off`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample coupons:', error);
    process.exit(1);
  }
};

createSampleCoupons();