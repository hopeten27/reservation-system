import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Slot from '../models/Slot.js';
import Review from '../models/Review.js';

// @desc    Bulk create slots
// @route   POST /api/v1/admin/bulk-slots
// @access  Private (Admin)
export const bulkCreateSlots = async (req, res, next) => {
  try {
    const { serviceId, startDate, endDate, timeSlots, capacity, daysOfWeek } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { message: 'Service not found', code: 'SERVICE_NOT_FOUND' }
      });
    }

    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (daysOfWeek.includes(date.getDay())) {
        for (const timeSlot of timeSlots) {
          const [hours, minutes] = timeSlot.split(':');
          const slotDate = new Date(date);
          slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          // Check if slot already exists
          const existingSlot = await Slot.findOne({
            service: serviceId,
            date: slotDate
          });

          if (!existingSlot) {
            slots.push({
              service: serviceId,
              date: slotDate,
              capacity,
              bookedCount: 0,
              status: 'open'
            });
          }
        }
      }
    }

    const createdSlots = await Slot.insertMany(slots);

    res.status(201).json({
      success: true,
      data: { 
        message: `Created ${createdSlots.length} slots successfully`,
        slotsCreated: createdSlots.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export data
// @route   POST /api/v1/admin/export
// @access  Private (Admin)
export const exportData = async (req, res, next) => {
  try {
    const { type, format, startDate, endDate, status } = req.body;

    let data = [];
    let filename = '';

    switch (type) {
      case 'bookings':
        const bookingQuery = {};
        if (startDate && endDate) {
          bookingQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (status) bookingQuery.status = status;

        const bookings = await Booking.find(bookingQuery)
          .populate('user', 'name email')
          .populate('service', 'name')
          .populate('slot', 'date');

        data = bookings.map(b => ({
          'Booking ID': b._id,
          'Customer': b.user?.name,
          'Email': b.user?.email,
          'Service': b.service?.name,
          'Date': b.slot?.date?.toLocaleDateString(),
          'Amount': b.amount,
          'Status': b.status,
          'Created': b.createdAt.toLocaleDateString()
        }));
        filename = 'bookings-export';
        break;

      case 'users':
        const users = await User.find({});
        data = users.map(u => ({
          'User ID': u._id,
          'Name': u.name,
          'Email': u.email,
          'Role': u.role,
          'Status': u.banned ? 'Banned' : 'Active',
          'Joined': u.createdAt.toLocaleDateString()
        }));
        filename = 'users-export';
        break;

      case 'services':
        const services = await Service.find({});
        data = services.map(s => ({
          'Service ID': s._id,
          'Name': s.name,
          'Category': s.category,
          'Price': s.price,
          'Duration': s.durationMinutes,
          'Status': s.isActive ? 'Active' : 'Inactive'
        }));
        filename = 'services-export';
        break;

      case 'revenue':
        const revenueBookings = await Booking.find({ status: { $in: ['confirmed', 'completed'] } })
          .populate('service', 'name');
        
        const revenueByService = {};
        revenueBookings.forEach(b => {
          const serviceName = b.service?.name || 'Unknown';
          revenueByService[serviceName] = (revenueByService[serviceName] || 0) + b.amount;
        });

        data = Object.entries(revenueByService).map(([service, revenue]) => ({
          'Service': service,
          'Revenue': revenue,
          'Bookings': revenueBookings.filter(b => b.service?.name === service).length
        }));
        filename = 'revenue-report';
        break;
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
    } else {
      // For PDF, return JSON data (frontend will handle PDF generation)
      res.json({
        success: true,
        data: JSON.stringify(data)
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    
    const days = parseInt(range.replace('d', '')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total bookings
    const totalBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // New users
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Average rating
    const avgRatingResult = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingResult[0]?.avg?.toFixed(1) || '0.0';

    // Popular services
    const popularServices = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { label: '$service.name', value: '$count' } },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ]);

    // Revenue by service
    const revenueByService = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: '$service', revenue: { $sum: '$amount' } } },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { label: '$service.name', value: '$revenue' } },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ]);

    // Booking status distribution
    const bookingStatus = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { label: '$_id', value: '$count' } }
    ]);

    // Recent activity
    const recentActivity = await Booking.find({ createdAt: { $gte: startDate } })
      .populate('user', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedActivity = recentActivity.map(booking => ({
      icon: '📅',
      title: `${booking.user?.name} booked ${booking.service?.name}`,
      time: booking.createdAt.toLocaleDateString(),
      value: `$${booking.amount}`
    }));

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        newUsers,
        avgRating,
        popularServices,
        revenueByService,
        bookingStatus,
        peakHours: [
          { label: '9 AM', value: 15 },
          { label: '12 PM', value: 25 },
          { label: '3 PM', value: 20 },
          { label: '6 PM', value: 30 }
        ],
        recentActivity: formattedActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users with filters
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status === 'banned') query.banned = true;
    if (status === 'active') query.banned = { $ne: true };

    const users = await User.find(query).sort({ createdAt: -1 });

    // Add booking count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingCount
        };
      })
    );

    res.json({
      success: true,
      data: { users: usersWithStats }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban/unban user
// @route   PUT /api/v1/admin/users/:id/ban
// @access  Private (Admin)
export const banUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { banned },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      });
    }

    res.json({
      success: true,
      data: { 
        user,
        message: `User ${banned ? 'banned' : 'unbanned'} successfully`
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');
  
  return csvContent;
};