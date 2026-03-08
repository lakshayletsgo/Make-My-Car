# Make My Car Backend

Production-grade backend API for the Make My Car platform - a marketplace for car services, accessories, insurance, and maintenance.

## Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose

## Features

- 🔐 **Authentication** - Register, login, JWT refresh tokens, password change
- 🚗 **Car Profiles** - CRUD operations for user car profiles
- 🏪 **Vendors** - Comprehensive vendor management with categories, ratings, and geo-search
- ⭐ **Reviews** - User reviews with moderation system
- ❤️ **Favorites** - Save favorite vendors
- 📊 **Dashboard** - Admin analytics and KPIs
- 🌍 **Location-based** - Find nearby vendors with distance calculation

## Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # Business logic
│   ├── utils/             # Utilities
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── docker-compose.yml     # Production Docker config
├── docker-compose.dev.yml # Development Docker config
├── Dockerfile             # Container build
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL 15+ (or Docker)

### Installation

```bash
# Clone and navigate
cd Backend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
```

### Database Setup

**Option 1: Using Docker (Recommended)**

```bash
# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d postgres

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://makemycar:makemycar_dev@localhost:5432/make_my_car?schema=public"
```

**Option 2: Local PostgreSQL**

Create a database and update the `DATABASE_URL` in `.env`.

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### Running the Server

```bash
# Development mode (with hot reload)
pnpm dev

# Production build
pnpm build
pnpm start
```

The API will be available at `http://localhost:3001/api/v1`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |
| PATCH | `/auth/me` | Update profile |
| POST | `/auth/change-password` | Change password |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cars/brands` | Get all car brands |
| GET | `/cars/brands/:id/models` | Get models by brand |
| POST | `/cars` | Create car profile |
| GET | `/cars` | Get user's cars |
| GET | `/cars/:id` | Get car by ID |
| PATCH | `/cars/:id` | Update car |
| DELETE | `/cars/:id` | Delete car |

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors` | List vendors (with filters) |
| GET | `/vendors/:id` | Get vendor by ID |
| GET | `/vendors/slug/:slug` | Get vendor by slug |
| GET | `/vendors/category/:category` | Get vendors by category |
| GET | `/vendors/nearby` | Find nearby vendors |
| POST | `/vendors` | Create vendor (admin) |
| PATCH | `/vendors/:id` | Update vendor (admin) |
| PATCH | `/vendors/:id/verify` | Verify vendor (admin) |
| DELETE | `/vendors/:id` | Delete vendor (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/vendor/:vendorId` | Get vendor reviews |
| POST | `/reviews` | Create review |
| GET | `/reviews/me` | Get user's reviews |
| PATCH | `/reviews/:id` | Update review |
| DELETE | `/reviews/:id` | Delete review |
| PATCH | `/reviews/:id/moderate` | Moderate review (admin) |

### Cities & Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cities` | Get all cities |
| GET | `/cities/:id` | Get city by ID |
| POST | `/cities` | Create city (admin) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/favorites` | Get user's favorites |
| POST | `/favorites/:vendorId` | Add to favorites |
| DELETE | `/favorites/:vendorId` | Remove from favorites |

### Dashboard (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get platform stats |
| GET | `/dashboard/recent-vendors` | Get recent vendors |
| GET | `/dashboard/top-cities` | Get top cities |
| GET | `/dashboard/activity` | Get recent activity |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## Docker Deployment

### Production

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed database
docker-compose exec api node dist/prisma/seed.js
```

### Development

```bash
# Start only PostgreSQL
docker-compose -f docker-compose.dev.yml up -d postgres

# Access pgAdmin at http://localhost:5050
# Email: admin@makemycar.com
# Password: admin123
```

## Default Credentials

After seeding, you can login with:

**Admin User**
- Email: `admin@makemycar.com`
- Password: `Admin@123`

**Demo User**
- Email: `demo@makemycar.com`
- Password: `Demo@123`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT License
