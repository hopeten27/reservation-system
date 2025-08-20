import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalBookings,
      totalRevenue,
      activeServices,
      todayBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeServices,
        todayBookings
      }
    });
  } catch (error) {
    next(error);
  }
};