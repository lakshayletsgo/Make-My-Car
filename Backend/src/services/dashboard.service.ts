import prisma from '../utils/prisma.js';

export class DashboardService {
  /**
   * Get dashboard stats
   */
  async getStats() {
    const [
      totalUsers,
      totalVendors,
      verifiedVendors,
      totalReviews,
      totalCars,
      recentUsers,
      recentVendors,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count({ where: { isActive: true } }),
      prisma.vendor.count({ where: { isActive: true, isVerified: true } }),
      prisma.review.count({ where: { status: 'APPROVED' } }),
      prisma.car.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.vendor.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate percentage changes (simplified)
    const previousMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const userGrowth = previousMonthUsers > 0 
      ? ((recentUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
      : '0';

    return {
      totalUsers,
      totalVendors,
      verifiedVendors,
      totalReviews,
      totalCars,
      recentUsers,
      recentVendors,
      userGrowth: `${userGrowth}%`,
    };
  }

  /**
   * Get recent vendors
   */
  async getRecentVendors(limit = 10) {
    return prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        city: true,
      },
    });
  }

  /**
   * Get top cities by vendor count
   */
  async getTopCities(limit = 5) {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { vendors: true, cars: true },
        },
      },
      orderBy: {
        vendors: { _count: 'desc' },
      },
      take: limit,
    });

    const maxVendors = cities.length > 0 ? Math.max(...cities.map(c => c._count.vendors)) : 1;

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      vendorCount: city._count.vendors,
      carCount: city._count.cars,
      percentage: Math.round((city._count.vendors / maxVendors) * 100),
    }));
  }

  /**
   * Get vendor statistics by category
   */
  async getVendorsByCategory() {
    const categories = await prisma.vendor.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { id: true },
      _avg: { rating: true },
    });

    return categories.map((cat) => ({
      category: cat.category,
      count: cat._count.id,
      avgRating: cat._avg.rating?.toFixed(1) || '0',
    }));
  }

  /**
   * Get recent activity feed
   */
  async getRecentActivity(limit = 10) {
    const [recentReviews, recentUsers, recentVendors, recentCars] = await Promise.all([
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          vendor: { select: { name: true } },
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, email: true, createdAt: true },
      }),
      prisma.vendor.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, name: true, createdAt: true, isVerified: true },
      }),
      prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          brand: { select: { name: true } },
          model: { select: { name: true } },
        },
      }),
    ]);

    // Combine and sort activities
    const activities = [
      ...recentReviews.map((r) => ({
        type: 'review',
        action: 'Review submitted',
        detail: `${r.rating} stars for ${r.vendor.name}`,
        time: r.createdAt,
      })),
      ...recentUsers.map((u) => ({
        type: 'user',
        action: 'New user signup',
        detail: u.email,
        time: u.createdAt,
      })),
      ...recentVendors.map((v) => ({
        type: 'vendor',
        action: v.isVerified ? 'Vendor verified' : 'New vendor registered',
        detail: v.name,
        time: v.createdAt,
      })),
      ...recentCars.map((c) => ({
        type: 'car',
        action: 'Car profile created',
        detail: `${c.brand.name} ${c.model.name}`,
        time: c.createdAt,
      })),
    ];

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit)
      .map((activity) => ({
        ...activity,
        time: this.formatTimeAgo(activity.time),
      }));
  }

  /**
   * Get analytics for recommendations served
   */
  async getRecommendationsServed() {
    const count = await prisma.analytics.count({
      where: { type: 'RECOMMENDATION_SERVED' },
    });

    return count;
  }

  /**
   * Format time ago
   */
  private formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  }
}

export const dashboardService = new DashboardService();
