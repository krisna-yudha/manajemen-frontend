# Management Frontend

Frontend aplikasi manajemen yang terhubung dengan Laravel 12 API menggunakan Next.js, TypeScript, dan Tailwind CSS.

## Features

- ✅ **Authentication System** - Login & Register
- ✅ **JWT Token Management** - Automatic token handling
- ✅ **Protected Routes** - Dashboard protection
- ✅ **API Integration** - Connected to Laravel 12
- ✅ **CRUD Operations** - Generic CRUD hooks
- ✅ **State Management** - React Query for API state
- ✅ **Responsive Design** - Tailwind CSS styling
- ✅ **TypeScript** - Type-safe development

## Tech Stack

- **Framework**: Next.js 15.4.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Authentication**: JWT Tokens

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy dan edit file `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Ganti URL sesuai dengan endpoint Laravel API Anda.

### 3. Start Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Laravel API Requirements

Pastikan Laravel API Anda memiliki endpoint berikut:

### Authentication Endpoints

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user  
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### CRUD Endpoints (Example: Products)

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Response Format

API harus mengembalikan response dalam format:

```json
{
  "success": true|false,
  "message": "Success message",
  "data": {...}
}
```

### Authentication Response

Login dan register harus mengembalikan:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "token": "jwt_token_here"
  }
}
```

## Project Structure

```
manajemen-frontend/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom hooks
│   └── useApi.ts       # API hooks with React Query
├── lib/                # Utilities
│   └── api.ts          # Axios configuration
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   ├── index.tsx       # Homepage
│   ├── login.tsx       # Login page
│   ├── register.tsx    # Register page
│   ├── dashboard.tsx   # Dashboard page
│   └── 404.tsx         # 404 error page
├── services/           # API services
│   └── api.ts          # API service functions
└── styles/             # Styling
    └── globals.css     # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User mengisi form login/register
2. Frontend mengirim request ke Laravel API
3. Laravel mengembalikan JWT token dan user data
4. Token disimpan di localStorage
5. Token digunakan untuk request selanjutnya
6. Jika token expired, user dialihkan ke login

## Adding New Models

Untuk menambah model baru (misalnya Categories):

### 1. Define Interface

Tambahkan di `services/api.ts`:

```typescript
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const categoryService = createCRUDService<Category>('categories');
```

### 2. Create Hooks

Tambahkan di `hooks/useApi.ts`:

```typescript
export const categoryHooks = useCRUDHooks<Category>('categories', categoryService);
```

### 3. Use in Components

```typescript
import { categoryHooks } from '@/hooks/useApi';

export default function CategoriesPage() {
  const { useGetAll } = categoryHooks;
  const { data, isLoading, error } = useGetAll();
  
  // Render your component
}
```

## CORS Configuration

Pastikan Laravel API mengizinkan CORS dari domain frontend:

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

## Production Deployment

### 1. Build Project

```bash
npm run build
```

### 2. Update Environment

Update `NEXT_PUBLIC_API_URL` ke production API URL.

### 3. Deploy

Deploy ke platform pilihan (Vercel, Netlify, dll).

## Troubleshooting

### CORS Error
- Pastikan Laravel API mengizinkan CORS dari domain frontend
- Check headers `Accept` dan `Content-Type`

### 401 Unauthorized
- Check token validity
- Pastikan token dikirim dalam header `Authorization: Bearer {token}`

### Network Error
- Pastikan Laravel API berjalan
- Check URL di environment variable
- Pastikan endpoint tersedia

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.