# 📚 Management System API Documentation

## 🌟 Overview
This is a comprehensive REST API for Inventory and Rental Management System built with Laravel 12.20.0. The API provides full functionality for managing items, rentals, users, and generating reports with role-based access control.

## 🔧 Tech Stack
- **Framework**: Laravel 12.20.0
- **Authentication**: Laravel Sanctum
- **Database**: MySQL
- **PHP Version**: 8.3.21
- **API Format**: RESTful JSON

## 🌐 Base Information
- **Base URL**: `http://127.0.0.1:8000/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (Laravel Sanctum)

---

## 🔐 Authentication

### Required Headers for Protected Routes
```http
Authorization: Bearer {your_token}
Accept: application/json
Content-Type: application/json
```

### Role-Based Access Control
- **Member**: Basic rental operations, view available items
- **Gudang**: + Item management, stock control, rental approvals
- **Manager**: + User management, full system access, reports

---

## 📋 API Endpoints

### 🔓 Public Routes (No Authentication)

#### Authentication
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/login` | User login | `email`, `password` |
| `POST` | `/register` | User registration | `name`, `email`, `password`, `password_confirmation` |
| `GET` | `/test` | API health check | - |

#### Example Login Request
```json
POST /api/login
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### Example Response
```json
{
    "status": "success",
    "message": "Login successful",
    "token": "1|abcdef...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "role": "member"
    }
}
```

---

### 🔒 Protected Routes (Authentication Required)

#### 🔐 User Management
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/logout` | User logout | All Users |
| `GET` | `/user` | Get current user data | All Users |

---

#### 📦 Items (Barang) Management

| Method | Endpoint | Description | Access Level | Parameters |
|--------|----------|-------------|--------------|------------|
| `GET` | `/barangs` | List all items | All Users | `search`, `kategori`, `status`, `page`, `per_page` |
| `GET` | `/barangs/available/list` | Get available items for rental | All Users | `search`, `kategori` |
| `GET` | `/barangs/categories/list` | Get all item categories | All Users | - |
| `GET` | `/barangs/{id}` | Get specific item details | All Users | - |
| `POST` | `/barangs` | Create new item | Gudang+ | Item data |
| `PUT` | `/barangs/{id}` | Update item | Gudang+ | Item data |
| `DELETE` | `/barangs/{id}` | Delete item | Gudang+ | - |

#### Example: Get Available Items
```http
GET /api/barangs/available/list?search=laptop&kategori=Elektronik
Authorization: Bearer {token}
```

#### Example: Create New Item
```json
POST /api/barangs
Authorization: Bearer {token}
{
    "kode_barang": "ELK001",
    "nama_barang": "Laptop Dell XPS",
    "deskripsi": "Laptop untuk keperluan kantor",
    "kategori": "Elektronik",
    "stok": 10,
    "stok_minimum": 2,
    "kondisi": "baik",
    "lokasi_penyimpanan": "Gudang A",
    "harga_sewa_per_hari": 50000,
    "status": "tersedia"
}
```

---

#### 🏠 Rental Management

| Method | Endpoint | Description | Access Level | Parameters |
|--------|----------|-------------|--------------|------------|
| `GET` | `/rentals` | List all rentals | Manager/Gudang | `status`, `user_id`, `barang_id`, `page` |
| `POST` | `/rentals` | Create new rental | All Users | Rental data |
| `GET` | `/rentals/{id}` | Get rental details | Owner/Manager/Gudang | - |
| `PUT` | `/rentals/{id}` | Update rental | Manager/Gudang | Rental data |
| `PATCH` | `/rentals/{id}/status` | Update rental status | Manager/Gudang | `status`, `catatan` |
| `GET` | `/rentals/user/mine` | Get current user's rentals | All Users | `status`, `page` |
| `GET` | `/rentals/pending/list` | Get pending rentals | Manager/Gudang | - |
| `GET` | `/rentals/ongoing/list` | Get ongoing rentals | Manager/Gudang | - |
| `GET` | `/rentals/completed/list` | Get completed rentals | Manager/Gudang | - |

#### Example: Create Rental Request
```json
POST /api/rentals
Authorization: Bearer {token}
{
    "barang_id": 1,
    "jumlah": 2,
    "tanggal_pinjam": "2025-07-30",
    "tanggal_kembali_rencana": "2025-08-05",
    "keperluan": "Event kantor bulanan"
}
```

#### Example: Update Rental Status
```json
PATCH /api/rentals/1/status
Authorization: Bearer {token}
{
    "status": "approved",
    "catatan": "Rental disetujui, silakan ambil barang di gudang"
}
```

#### Rental Status Flow
- `pending` → `approved` → `ongoing` → `returned`
- `pending` → `rejected`

---

#### 📊 Stock Management

| Method | Endpoint | Description | Access Level | Parameters |
|--------|----------|-------------|--------------|------------|
| `GET` | `/stocks` | Get stock overview | Gudang+ | `barang_id`, `page` |
| `POST` | `/stocks/adjust` | Adjust stock levels | Gudang+ | Adjustment data |
| `GET` | `/stocks/logs` | Get stock change logs | Gudang+ | `barang_id`, `action_type`, `page` |
| `GET` | `/stocks/low-stock` | Get low stock alerts | Gudang+ | `threshold` |

#### Example: Stock Adjustment
```json
POST /api/stocks/adjust
Authorization: Bearer {token}
{
    "barang_id": 1,
    "adjustment_type": "add",
    "adjustment_amount": 5,
    "adjustment_reason": "Pembelian barang baru"
}
```

---

#### 👥 User Management (Manager & Gudang Only)

| Method | Endpoint | Description | Access Level | Parameters |
|--------|----------|-------------|--------------|------------|
| `GET` | `/users` | List all users | Manager/Gudang | `role`, `is_active`, `search`, `page` |
| `POST` | `/users` | Create new user | Manager/Gudang | User data |
| `GET` | `/users/{id}` | Get user details | Manager/Gudang | - |
| `PUT` | `/users/{id}` | Update user | Manager/Gudang | User data |
| `DELETE` | `/users/{id}` | Delete user | Manager/Gudang | - |
| `PATCH` | `/users/{id}/toggle-status` | Toggle user status | Manager/Gudang | - |

#### Example: Create User
```json
POST /api/users
Authorization: Bearer {token}
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "member",
    "is_active": true
}
```

---

#### 📈 Dashboard & Reports (Manager Only)

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/dashboard/stats` | Get dashboard statistics | Manager |
| `GET` | `/reports/summary` | Get reports summary | Manager |

#### Example: Dashboard Stats Response
```json
{
    "status": "success",
    "data": {
        "total_users": 25,
        "active_rentals": 12,
        "pending_approvals": 3,
        "total_items": 150,
        "available_items": 98,
        "low_stock_items": 5,
        "monthly_rental_trend": [...],
        "category_distribution": [...]
    }
}
```

---

## 🚀 Frontend Integration Guide

### JavaScript/Node.js Implementation

#### 1. Base API Client Setup
```javascript
class APIClient {
    constructor() {
        this.baseURL = 'http://127.0.0.1:8000/api';
        this.token = localStorage.getItem('auth_token');
    }

    getHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: this.getHeaders()
        };

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API Error');
        }
        
        return result;
    }
}
```

#### 2. Authentication Service
```javascript
export const authService = {
    async login(email, password) {
        const response = await api.apiCall('/login', 'POST', { email, password });
        if (response.token) {
            localStorage.setItem('auth_token', response.token);
            api.token = response.token;
        }
        return response;
    },

    async logout() {
        await api.apiCall('/logout', 'POST');
        localStorage.removeItem('auth_token');
        api.token = null;
    }
};
```

#### 3. Items Service
```javascript
export const itemsService = {
    async getAvailable(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = params ? `/barangs/available/list?${params}` : '/barangs/available/list';
        return await api.apiCall(endpoint);
    },

    async getById(id) {
        return await api.apiCall(`/barangs/${id}`);
    }
};
```

#### 4. Rentals Service
```javascript
export const rentalsService = {
    async create(rentalData) {
        return await api.apiCall('/rentals', 'POST', rentalData);
    },

    async getMine(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = params ? `/rentals/user/mine?${params}` : '/rentals/user/mine';
        return await api.apiCall(endpoint);
    }
};
```

---

## ❌ Error Handling

### Standard Error Response Format
```json
{
    "status": "error",
    "message": "Error description",
    "errors": {
        "field_name": ["Validation error message"]
    }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid Token)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (Validation Failed)
- `500` - Internal Server Error

---

## 🔒 Security Features

- ✅ **Laravel Sanctum Authentication**
- ✅ **Role-based Access Control (RBAC)**
- ✅ **Active User Validation**
- ✅ **CSRF Protection**
- ✅ **Input Validation & Sanitization**
- ✅ **Rate Limiting**
- ✅ **SQL Injection Prevention**
- ✅ **XSS Protection**

---

## 📊 API Testing

### Using cURL
```bash
# Test API health
curl -X GET http://127.0.0.1:8000/api/test

# Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get available items (with token)
curl -X GET http://127.0.0.1:8000/api/barangs/available/list \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### Using Postman
1. Import the base URL: `http://127.0.0.1:8000/api`
2. Set Authorization Type to "Bearer Token"
3. Add the token received from login
4. Set Accept header to `application/json`

---

## 📝 Frontend Integration Checklist

### ✅ Minimal Required APIs (MVP)
- [ ] `POST /api/login` - Authentication
- [ ] `GET /api/barangs/available/list` - Available items
- [ ] `POST /api/rentals` - Create rental
- [ ] `GET /api/rentals/user/mine` - User's rentals

### 🔄 Standard Features
- [ ] `POST /api/register` - User registration
- [ ] `GET /api/barangs/categories/list` - Categories
- [ ] `GET /api/rentals/{id}` - Rental details
- [ ] `POST /api/logout` - Logout

### ⚡ Advanced Features (Admin)
- [ ] `GET /api/rentals/pending/list` - Pending approvals
- [ ] `PATCH /api/rentals/{id}/status` - Status updates
- [ ] `GET /api/dashboard/stats` - Dashboard data
- [ ] `POST /api/barangs` - Item management

---

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is valid and not expired
   - Ensure Authorization header is properly set

2. **403 Forbidden**
   - Verify user has required role permissions
   - Check if user account is active

3. **422 Validation Error**
   - Review request payload format
   - Check required fields are provided

4. **CORS Issues**
   - Ensure frontend domain is added to CORS configuration
   - Check preflight OPTIONS requests

---

## 📞 Support

For technical support or questions about this API:
- **Developer**: Management System Team
- **Version**: 1.0.0
- **Last Updated**: July 29, 2025

---

## 📄 License

This API documentation is part of the Management System project. All rights reserved.
