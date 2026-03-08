import prisma from '../utils/prisma.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import type { CreateCityInput, UpdateCityInput, CreateBrandInput, CreateModelInput } from '../schemas/common.schema.js';

export class CommonService {
  // ============================================
  // CITIES
  // ============================================

  async getCities() {
    return prisma.city.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        state: true,
        latitude: true,
        longitude: true,
        _count: {
          select: { vendors: true },
        },
      },
    });
  }

  async getCityById(id: string) {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { vendors: true, cars: true },
        },
      },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    return city;
  }

  async createCity(data: CreateCityInput) {
    const existingCity = await prisma.city.findUnique({
      where: { name: data.name },
    });

    if (existingCity) {
      throw new ConflictError('City already exists');
    }

    return prisma.city.create({ data });
  }

  async updateCity(id: string, data: UpdateCityInput) {
    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    return prisma.city.update({
      where: { id },
      data,
    });
  }

  async deleteCity(id: string) {
    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    // Soft delete
    return prisma.city.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ============================================
  // CAR BRANDS
  // ============================================

  async getBrands() {
    return prisma.carBrand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { models: true },
        },
      },
    });
  }

  async getBrandById(id: string) {
    const brand = await prisma.carBrand.findUnique({
      where: { id },
      include: {
        models: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    return brand;
  }

  async createBrand(data: CreateBrandInput) {
    const existingBrand = await prisma.carBrand.findUnique({
      where: { name: data.name },
    });

    if (existingBrand) {
      throw new ConflictError('Brand already exists');
    }

    return prisma.carBrand.create({ data });
  }

  // ============================================
  // CAR MODELS
  // ============================================

  async getModelsByBrand(brandId: string) {
    const brand = await prisma.carBrand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    return prisma.carModel.findMany({
      where: { brandId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createModel(data: CreateModelInput) {
    const brand = await prisma.carBrand.findUnique({
      where: { id: data.brandId },
    });

    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    const existingModel = await prisma.carModel.findFirst({
      where: { name: data.name, brandId: data.brandId },
    });

    if (existingModel) {
      throw new ConflictError('Model already exists for this brand');
    }

    return prisma.carModel.create({ data });
  }

  // ============================================
  // FAVORITES
  // ============================================

  async addFavorite(userId: string, vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_vendorId: { userId, vendorId },
      },
    });

    if (existingFavorite) {
      throw new ConflictError('Vendor already in favorites');
    }

    return prisma.favorite.create({
      data: { userId, vendorId },
      include: {
        vendor: {
          include: { city: true },
        },
      },
    });
  }

  async removeFavorite(userId: string, vendorId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_vendorId: { userId, vendorId },
      },
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        vendor: {
          include: {
            city: true,
            products: { take: 5 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const commonService = new CommonService();
