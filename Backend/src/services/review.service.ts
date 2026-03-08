import { Prisma, ReviewStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors.js';
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput } from '../schemas/review.schema.js';

export class ReviewService {
  /**
   * Create a new review
   */
  async create(userId: string, data: CreateReviewInput) {
    // Verify vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: data.vendorId },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Check if user already reviewed this vendor
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_vendorId: {
          userId,
          vendorId: data.vendorId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictError('You have already reviewed this vendor');
    }

    const review = await prisma.review.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        vendor: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Update vendor rating
    await this.updateVendorRating(data.vendorId);

    // Log analytics
    await prisma.analytics.create({
      data: {
        type: 'REVIEW_SUBMITTED',
        data: { reviewId: review.id, vendorId: data.vendorId, rating: data.rating },
      },
    });

    return review;
  }

  /**
   * Get all reviews with filtering
   */
  async findAll(query: ReviewQueryInput) {
    const { vendorId, userId, status, minRating, page, limit, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
          vendor: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total, page, limit };
  }

  /**
   * Get reviews for a vendor (public - only approved)
   */
  async findByVendor(vendorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          vendorId,
          status: 'APPROVED',
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({
        where: {
          vendorId,
          status: 'APPROVED',
        },
      }),
    ]);

    return { reviews, total, page, limit };
  }

  /**
   * Get a single review
   */
  async findById(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        vendor: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return review;
  }

  /**
   * Update a review
   */
  async update(id: string, userId: string, data: UpdateReviewInput) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenError('You can only edit your own reviews');
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...data,
        status: 'PENDING', // Reset status on edit
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        vendor: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Update vendor rating if rating changed
    if (data.rating !== undefined) {
      await this.updateVendorRating(review.vendorId);
    }

    return updatedReview;
  }

  /**
   * Delete a review
   */
  async delete(id: string, userId: string, isAdmin = false) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id },
    });

    // Update vendor rating
    await this.updateVendorRating(review.vendorId);
  }

  /**
   * Moderate review (admin only)
   */
  async moderate(id: string, status: ReviewStatus) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        vendor: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Update vendor rating when status changes
    await this.updateVendorRating(review.vendorId);

    return updatedReview;
  }

  /**
   * Update vendor's average rating
   */
  private async updateVendorRating(vendorId: string) {
    const result = await prisma.review.aggregate({
      where: {
        vendorId,
        status: 'APPROVED',
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }
}

export const reviewService = new ReviewService();
