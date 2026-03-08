import prisma from '../utils/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import type { CreateCarInput, UpdateCarInput } from '../schemas/car.schema.js';

export class CarService {
  /**
   * Create a new car profile
   */
  async create(userId: string, data: CreateCarInput) {
    // Verify brand exists
    const brand = await prisma.carBrand.findUnique({
      where: { id: data.brandId },
    });

    if (!brand) {
      throw new NotFoundError('Car brand not found');
    }

    // Verify model exists and belongs to brand
    const model = await prisma.carModel.findFirst({
      where: { id: data.modelId, brandId: data.brandId },
    });

    if (!model) {
      throw new NotFoundError('Car model not found or does not belong to selected brand');
    }

    // Verify city exists
    const city = await prisma.city.findUnique({
      where: { id: data.cityId },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    const car = await prisma.car.create({
      data: {
        ...data,
        userId,
      },
      include: {
        brand: true,
        model: true,
        city: true,
      },
    });

    // Log analytics
    await prisma.analytics.create({
      data: {
        type: 'CAR_PROFILE_CREATED',
        data: {
          userId,
          carId: car.id,
          brand: brand.name,
          model: model.name,
        },
      },
    });

    return car;
  }

  /**
   * Get all cars for a user
   */
  async findByUser(userId: string) {
    return prisma.car.findMany({
      where: { userId, isActive: true },
      include: {
        brand: true,
        model: true,
        city: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single car by ID
   */
  async findById(id: string, userId: string) {
    const car = await prisma.car.findFirst({
      where: { id, userId },
      include: {
        brand: true,
        model: true,
        city: true,
      },
    });

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    return car;
  }

  /**
   * Update a car profile
   */
  async update(id: string, userId: string, data: UpdateCarInput) {
    // Verify car exists and belongs to user
    const existingCar = await prisma.car.findFirst({
      where: { id, userId },
    });

    if (!existingCar) {
      throw new NotFoundError('Car not found');
    }

    // Validate brand if provided
    if (data.brandId) {
      const brand = await prisma.carBrand.findUnique({
        where: { id: data.brandId },
      });
      if (!brand) {
        throw new NotFoundError('Car brand not found');
      }
    }

    // Validate model if provided
    if (data.modelId) {
      const brandId = data.brandId || existingCar.brandId;
      const model = await prisma.carModel.findFirst({
        where: { id: data.modelId, brandId },
      });
      if (!model) {
        throw new NotFoundError('Car model not found or does not belong to selected brand');
      }
    }

    // Validate city if provided
    if (data.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: data.cityId },
      });
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    return prisma.car.update({
      where: { id },
      data,
      include: {
        brand: true,
        model: true,
        city: true,
      },
    });
  }

  /**
   * Delete a car profile (soft delete)
   */
  async delete(id: string, userId: string) {
    const car = await prisma.car.findFirst({
      where: { id, userId },
    });

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    return prisma.car.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get all car brands
   */
  async getBrands() {
    return prisma.carBrand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get models by brand
   */
  async getModelsByBrand(brandId: string) {
    return prisma.carModel.findMany({
      where: { brandId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}

export const carService = new CarService();
