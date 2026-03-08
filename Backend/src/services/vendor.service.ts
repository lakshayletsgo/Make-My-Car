import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import type { CreateVendorInput, UpdateVendorInput, VendorQueryInput } from '../schemas/vendor.schema.js';

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export class VendorService {
  /**
   * Create a new vendor
   */
  async create(data: CreateVendorInput) {
    const { products, ...vendorData } = data;

    // Verify city exists
    const city = await prisma.city.findUnique({
      where: { id: data.cityId },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    // Generate unique slug
    let slug = createSlug(data.name);
    let counter = 0;
    while (await prisma.vendor.findUnique({ where: { slug } })) {
      counter++;
      slug = `${createSlug(data.name)}-${counter}`;
    }

    const vendor = await prisma.vendor.create({
      data: {
        ...vendorData,
        slug,
        products: products
          ? {
              create: products.map((name) => ({ name })),
            }
          : undefined,
      },
      include: {
        city: true,
        products: true,
      },
    });

    // Log analytics
    await prisma.analytics.create({
      data: {
        type: 'VENDOR_REGISTRATION',
        data: { vendorId: vendor.id, name: vendor.name },
      },
    });

    return vendor;
  }

  /**
   * Get all vendors with filtering and pagination
   */
  async findAll(query: VendorQueryInput) {
    const {
      category,
      cityId,
      minRating,
      verified,
      search,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.VendorWhereInput = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (verified !== undefined) {
      where.isVerified = verified;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          city: true,
          products: {
            take: 5,
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.vendor.count({ where }),
    ]);

    return { vendors, total, page, limit };
  }

  /**
   * Get vendor by ID
   */
  async findById(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        city: true,
        products: true,
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Log analytics
    await prisma.analytics.create({
      data: {
        type: 'VENDOR_VIEW',
        data: { vendorId: vendor.id },
      },
    });

    return vendor;
  }

  /**
   * Get vendor by slug
   */
  async findBySlug(slug: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { slug },
      include: {
        city: true,
        products: true,
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Log analytics
    await prisma.analytics.create({
      data: {
        type: 'VENDOR_VIEW',
        data: { vendorId: vendor.id },
      },
    });

    return vendor;
  }

  /**
   * Update vendor
   */
  async update(id: string, data: UpdateVendorInput) {
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      throw new NotFoundError('Vendor not found');
    }

    const { products, ...vendorData } = data;

    // Update vendor
    await prisma.vendor.update({
      where: { id },
      data: vendorData,
    });

    // Update products if provided
    if (products) {
      // Delete existing products
      await prisma.product.deleteMany({
        where: { vendorId: id },
      });

      // Create new products
      await prisma.product.createMany({
        data: products.map((name) => ({
          name,
          vendorId: id,
        })),
      });
    }

    return this.findById(id);
  }

  /**
   * Delete vendor (soft delete)
   */
  async delete(id: string) {
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      throw new NotFoundError('Vendor not found');
    }

    return prisma.vendor.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Verify vendor (admin only)
   */
  async verify(id: string, verified: boolean) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    return prisma.vendor.update({
      where: { id },
      data: { isVerified: verified },
    });
  }

  /**
   * Get vendors by category
   */
  async findByCategory(category: string) {
    return prisma.vendor.findMany({
      where: {
        category: category as any,
        isActive: true,
      },
      include: {
        city: true,
        products: {
          take: 5,
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get nearby vendors
   */
  async findNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    // Simple bounding box calculation
    const latDiff = radiusKm / 111; // ~111km per degree latitude
    const lonDiff = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    const vendors = await prisma.vendor.findMany({
      where: {
        isActive: true,
        latitude: {
          gte: latitude - latDiff,
          lte: latitude + latDiff,
        },
        longitude: {
          gte: longitude - lonDiff,
          lte: longitude + lonDiff,
        },
      },
      include: {
        city: true,
        products: {
          take: 5,
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Calculate actual distance and filter
    return vendors
      .map((vendor) => ({
        ...vendor,
        distance: this.calculateDistance(latitude, longitude, vendor.latitude, vendor.longitude),
      }))
      .filter((vendor) => vendor.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }
}

export const vendorService = new VendorService();
