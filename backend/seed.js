// Seed script for initial test data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Plan from './models/Plan.js';
import Discount from './models/Discount.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Create admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const admin = new User({
        name: 'Admin User',
        phone: '1234567890',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active'
      });
      await admin.setPassword('admin123');
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      const user = new User({
        name: 'Test User',
        phone: '0987654321',
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      });
      await user.setPassword('password123');
      await user.save();
      console.log('✅ Test user created');
    }

    // Create sample plans
    const existingPlans = await Plan.countDocuments();
    if (existingPlans === 0) {
      const plans = [
        {
          name: 'Basic Plan',
          description: 'Basic subscription plan',
          price: 9.99,
          quota: '10GB',
          features: ['Basic Feature 1', 'Basic Feature 2'],
          status: 'active'
        },
        {
          name: 'Premium Plan',
          description: 'Premium subscription plan',
          price: 29.99,
          quota: '100GB',
          features: ['Premium Feature 1', 'Premium Feature 2', 'Premium Feature 3'],
          status: 'active'
        },
        {
          name: 'Enterprise Plan',
          description: 'Enterprise subscription plan',
          price: 99.99,
          quota: '1TB',
          features: ['Enterprise Feature 1', 'Enterprise Feature 2', 'Enterprise Feature 3', 'Enterprise Feature 4'],
          status: 'active'
        }
      ];

      await Plan.insertMany(plans);
      console.log('✅ Sample plans created');
    }

    // Create sample discount
    const existingDiscounts = await Discount.countDocuments();
    if (existingDiscounts === 0) {
      const discount = new Discount({
        code: 'WELCOME20',
        description: 'Welcome discount 20% off',
        percentage: 20,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        status: 'active'
      });
      await discount.save();
      console.log('✅ Sample discount created');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
