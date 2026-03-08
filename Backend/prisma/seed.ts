import { PrismaClient, UserRole, FuelType, VendorCategory, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // SEED CITIES
  // ============================================
  console.log('📍 Seeding cities...');
  const cities = await Promise.all([
    prisma.city.upsert({
      where: { name: 'Mumbai' },
      update: {},
      create: { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    }),
    prisma.city.upsert({
      where: { name: 'Delhi' },
      update: {},
      create: { name: 'Delhi', state: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
    }),
    prisma.city.upsert({
      where: { name: 'Bangalore' },
      update: {},
      create: { name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    }),
    prisma.city.upsert({
      where: { name: 'Hyderabad' },
      update: {},
      create: { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
    }),
    prisma.city.upsert({
      where: { name: 'Chennai' },
      update: {},
      create: { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    }),
    prisma.city.upsert({
      where: { name: 'Pune' },
      update: {},
      create: { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
    }),
    prisma.city.upsert({
      where: { name: 'Kolkata' },
      update: {},
      create: { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    }),
    prisma.city.upsert({
      where: { name: 'Ahmedabad' },
      update: {},
      create: { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    }),
    prisma.city.upsert({
      where: { name: 'Jaipur' },
      update: {},
      create: { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    }),
    prisma.city.upsert({
      where: { name: 'Lucknow' },
      update: {},
      create: { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
    }),
  ]);

  const mumbai = cities[0];

  // ============================================
  // SEED CAR BRANDS & MODELS
  // ============================================
  console.log('🚗 Seeding car brands and models...');
  
  const carBrandsData = [
    { name: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire', 'Alto', 'WagonR'] },
    { name: 'Hyundai', models: ['Creta', 'Venue', 'i20', 'Verna', 'Tucson', 'Aura'] },
    { name: 'Tata', models: ['Nexon', 'Punch', 'Harrier', 'Safari', 'Altroz', 'Tiago'] },
    { name: 'Mahindra', models: ['XUV700', 'Thar', 'Scorpio', 'XUV300', 'Bolero'] },
    { name: 'Kia', models: ['Seltos', 'Sonet', 'Carens', 'EV6'] },
    { name: 'Toyota', models: ['Fortuner', 'Innova', 'Glanza', 'Urban Cruiser', 'Camry'] },
    { name: 'Honda', models: ['City', 'Amaze', 'Elevate', 'WR-V'] },
    { name: 'MG', models: ['Hector', 'Astor', 'Gloster', 'ZS EV', 'Comet'] },
    { name: 'Skoda', models: ['Kushaq', 'Slavia', 'Superb', 'Kodiaq'] },
    { name: 'Volkswagen', models: ['Taigun', 'Virtus', 'Tiguan'] },
  ];

  for (const brandData of carBrandsData) {
    const brand = await prisma.carBrand.upsert({
      where: { name: brandData.name },
      update: {},
      create: { name: brandData.name },
    });

    for (const modelName of brandData.models) {
      await prisma.carModel.upsert({
        where: { name_brandId: { name: modelName, brandId: brand.id } },
        update: {},
        create: { name: modelName, brandId: brand.id },
      });
    }
  }

  // ============================================
  // SEED VENDORS
  // ============================================
  console.log('🏪 Seeding vendors...');
  
  const vendorsData = [
    // Insurance
    {
      name: 'SecureShield Insurance',
      slug: 'secureshield-insurance',
      category: VendorCategory.INSURANCE,
      description: 'Comprehensive car insurance with roadside assistance and zero depreciation cover. Quick claim settlement.',
      priceRange: '8,000 - 25,000/yr',
      address: 'Andheri West, Mumbai',
      latitude: 19.1364,
      longitude: 72.8296,
      rating: 4.8,
      reviewCount: 342,
      isVerified: true,
      products: ['Comprehensive Cover', 'Third Party', 'Zero Depreciation', 'Roadside Assistance'],
    },
    {
      name: 'DriveGuard Policies',
      slug: 'driveguard-policies',
      category: VendorCategory.INSURANCE,
      description: 'Affordable car insurance plans with cashless claim facility at 5,000+ garages nationwide.',
      priceRange: '6,500 - 18,000/yr',
      address: 'Bandra East, Mumbai',
      latitude: 19.0596,
      longitude: 72.8411,
      rating: 4.5,
      reviewCount: 218,
      isVerified: true,
      products: ['Basic Cover', 'Comprehensive', 'Engine Protect', 'Personal Accident'],
    },
    {
      name: 'AutoSafe Premium',
      slug: 'autosafe-premium',
      category: VendorCategory.INSURANCE,
      description: 'Premium insurance provider with dedicated claim managers and 24/7 support line.',
      priceRange: '12,000 - 35,000/yr',
      address: 'Powai, Mumbai',
      latitude: 19.1176,
      longitude: 72.9060,
      rating: 4.9,
      reviewCount: 567,
      isVerified: true,
      products: ['Premium Cover', 'Key Replacement', 'Tyre Protect', 'Return to Invoice'],
    },
    // Accessories
    {
      name: 'AutoStyle Hub',
      slug: 'autostyle-hub',
      category: VendorCategory.ACCESSORIES,
      description: 'Premium car accessories including alloy wheels, seat covers, infotainment systems, and LED lighting.',
      priceRange: '500 - 50,000',
      address: 'Kurla, Mumbai',
      latitude: 19.0726,
      longitude: 72.8845,
      rating: 4.6,
      reviewCount: 189,
      isVerified: true,
      products: ['Alloy Wheels', 'Seat Covers', 'Infotainment', 'LED Lights', 'Floor Mats'],
    },
    {
      name: 'CarMod Pro',
      slug: 'carmod-pro',
      category: VendorCategory.ACCESSORIES,
      description: 'Custom car modifications and genuine OEM parts. Performance upgrades and aesthetic enhancements.',
      priceRange: '1,000 - 80,000',
      address: 'Thane West, Mumbai',
      latitude: 19.2183,
      longitude: 72.9781,
      rating: 4.7,
      reviewCount: 275,
      isVerified: true,
      products: ['Body Kits', 'Exhaust Systems', 'Suspension', 'Wrap & Paint', 'Audio Systems'],
    },
    {
      name: 'QuickFit Accessories',
      slug: 'quickfit-accessories',
      category: VendorCategory.ACCESSORIES,
      description: 'One-stop shop for all car accessories with free installation on selected items.',
      priceRange: '300 - 25,000',
      address: 'Dadar, Mumbai',
      latitude: 19.0178,
      longitude: 72.8478,
      rating: 4.4,
      reviewCount: 156,
      isVerified: false,
      products: ['Car Covers', 'Phone Mounts', 'Dash Mats', 'Window Films', 'Perfumes'],
    },
    // Safety
    {
      name: 'SafeDrive Store',
      slug: 'safedrive-store',
      category: VendorCategory.SAFETY,
      description: 'Complete range of car safety equipment including dashcams, first-aid kits, and emergency tools.',
      priceRange: '500 - 15,000',
      address: 'Worli, Mumbai',
      latitude: 19.0176,
      longitude: 72.8156,
      rating: 4.8,
      reviewCount: 204,
      isVerified: true,
      products: ['Dashcams', 'First Aid Kits', 'Fire Extinguishers', 'Emergency Hammers', 'Reflective Vests'],
    },
    {
      name: 'GuardianAuto Safety',
      slug: 'guardianauto-safety',
      category: VendorCategory.SAFETY,
      description: 'Premium safety products with installation services. GPS trackers, TPMS, and blind-spot mirrors.',
      priceRange: '1,000 - 30,000',
      address: 'Goregaon, Mumbai',
      latitude: 19.1663,
      longitude: 72.8526,
      rating: 4.5,
      reviewCount: 132,
      isVerified: true,
      products: ['GPS Trackers', 'TPMS', 'Blind Spot Mirrors', 'Reverse Cameras', 'Parking Sensors'],
    },
    // Service Centers
    {
      name: 'ProMech Auto Care',
      slug: 'promech-auto-care',
      category: VendorCategory.SERVICE,
      description: 'Multi-brand service center with certified mechanics. Full range of maintenance, repair, and detailing.',
      priceRange: '1,500 - 20,000',
      address: 'Lower Parel, Mumbai',
      latitude: 19.0048,
      longitude: 72.8274,
      rating: 4.7,
      reviewCount: 489,
      isVerified: true,
      products: ['General Service', 'AC Repair', 'Denting & Painting', 'Detailing', 'Wheel Alignment'],
    },
    {
      name: 'SpeedFix Garage',
      slug: 'speedfix-garage',
      category: VendorCategory.SERVICE,
      description: 'Quick and reliable car repairs with transparent pricing. Specializing in engine and transmission work.',
      priceRange: '800 - 15,000',
      address: 'Malad West, Mumbai',
      latitude: 19.1874,
      longitude: 72.8484,
      rating: 4.4,
      reviewCount: 312,
      isVerified: true,
      products: ['Engine Repair', 'Transmission', 'Brake Service', 'Electrical', 'Diagnostics'],
    },
    {
      name: 'Elite Car Spa',
      slug: 'elite-car-spa',
      category: VendorCategory.SERVICE,
      description: 'Premium car washing, ceramic coating, and interior deep cleaning services with pickup and drop.',
      priceRange: '500 - 25,000',
      address: 'Juhu, Mumbai',
      latitude: 19.1075,
      longitude: 72.8263,
      rating: 4.9,
      reviewCount: 267,
      isVerified: true,
      products: ['Car Wash', 'Ceramic Coating', 'Interior Cleaning', 'PPF', 'Polishing'],
    },
  ];

  for (const vendorData of vendorsData) {
    const { products, ...vendor } = vendorData;
    
    const createdVendor = await prisma.vendor.upsert({
      where: { slug: vendor.slug },
      update: {},
      create: {
        ...vendor,
        cityId: mumbai.id,
      },
    });

    // Create products for vendor
    for (const productName of products) {
      await prisma.product.upsert({
        where: {
          id: `${createdVendor.id}-${productName.toLowerCase().replace(/\s+/g, '-')}`,
        },
        update: {},
        create: {
          id: `${createdVendor.id}-${productName.toLowerCase().replace(/\s+/g, '-')}`,
          name: productName,
          vendorId: createdVendor.id,
        },
      });
    }
  }

  // ============================================
  // SEED ADMIN USER
  // ============================================
  console.log('👤 Seeding admin user...');
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@makemycar.com' },
    update: {},
    create: {
      email: 'admin@makemycar.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // Seed a demo user
  const demoPassword = await bcrypt.hash('Demo@123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@makemycar.com' },
    update: {},
    create: {
      email: 'demo@makemycar.com',
      password: demoPassword,
      name: 'Demo User',
      role: UserRole.USER,
      isVerified: true,
    },
  });

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
