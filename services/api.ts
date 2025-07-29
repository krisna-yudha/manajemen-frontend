import api from '@/lib/api';

// Types sesuai dengan API documentation
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'gudang' | 'manager';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  deskripsi: string;
  kategori: string;
  stok: number;
  stok_minimum: number;
  kondisi: string;
  lokasi_penyimpanan: string;
  harga_sewa_per_hari: number;
  status: 'tersedia' | 'tidak_tersedia' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: number;
  user_id: number;
  barang_id: number;
  jumlah: number;
  tanggal_pinjam: string;
  tanggal_kembali_rencana: string;
  tanggal_kembali_aktual?: string;
  keperluan: string;
  status: 'pending' | 'approved' | 'rejected' | 'ongoing' | 'returned';
  catatan?: string;
  total_biaya?: number;
  user?: User;
  barang?: Barang;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  token?: string;
  user?: User;
  errors?: any;
}

// Auth Services - sesuai dengan API endpoints
export const authService = {
  login: async (data: LoginData): Promise<ApiResponse<any>> => {
    console.log('=== API SERVICE LOGIN ===');
    console.log('Sending login request with:', { email: data.email, password: '[PROVIDED]' });
    
    const response = await api.post('/login', data);
    console.log('Raw API response:', response);
    console.log('Response data:', response.data);
    
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<any>> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/logout');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/user');
    return response.data;
  },

  testConnection: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/test');
    return response.data;
  },
};

// Barang Services
export const barangService = {
  getAll: async (filters?: any): Promise<ApiResponse<Barang[]>> => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/barangs?${params}` : '/barangs';
    const response = await api.get(endpoint);
    return response.data;
  },

  getAvailable: async (filters?: any): Promise<ApiResponse<Barang[]>> => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/barangs/available/list?${params}` : '/barangs/available/list';
    const response = await api.get(endpoint);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/barangs/categories/list');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Barang>> => {
    const response = await api.get(`/barangs/${id}`);
    return response.data;
  },

  create: async (data: Partial<Barang>): Promise<ApiResponse<Barang>> => {
    const response = await api.post('/barangs', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Barang>): Promise<ApiResponse<Barang>> => {
    const response = await api.put(`/barangs/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/barangs/${id}`);
    return response.data;
  },
};

// Rental Services
export const rentalService = {
  getAll: async (filters?: any): Promise<ApiResponse<Rental[]>> => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/rentals?${params}` : '/rentals';
    const response = await api.get(endpoint);
    return response.data;
  },

  getMine: async (filters?: any): Promise<ApiResponse<Rental[]>> => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/rentals/user/mine?${params}` : '/rentals/user/mine';
    const response = await api.get(endpoint);
    return response.data;
  },

  getPending: async (): Promise<ApiResponse<Rental[]>> => {
    const response = await api.get('/rentals/pending/list');
    return response.data;
  },

  getOngoing: async (): Promise<ApiResponse<Rental[]>> => {
    const response = await api.get('/rentals/ongoing/list');
    return response.data;
  },

  getCompleted: async (): Promise<ApiResponse<Rental[]>> => {
    const response = await api.get('/rentals/completed/list');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Rental>> => {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  create: async (data: {
    barang_id: number;
    jumlah: number;
    tanggal_pinjam: string;
    tanggal_kembali_rencana: string;
    keperluan: string;
  }): Promise<ApiResponse<Rental>> => {
    const response = await api.post('/rentals', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Rental>): Promise<ApiResponse<Rental>> => {
    const response = await api.put(`/rentals/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: {
    status: string;
    catatan?: string;
  }): Promise<ApiResponse<Rental>> => {
    const response = await api.patch(`/rentals/${id}/status`, data);
    return response.data;
  },
};

// Dashboard Services (Manager only)
export const dashboardService = {
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getReportsSummary: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
};

// User Management Services (Manager/Gudang only)
export const userService = {
  getAll: async (filters?: any): Promise<ApiResponse<User[]>> => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/users?${params}` : '/users';
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    is_active?: boolean;
  }): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  toggleStatus: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },
};
