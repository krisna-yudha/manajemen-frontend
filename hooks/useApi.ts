import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  authService, 
  barangService, 
  rentalService, 
  dashboardService,
  userService,
  type LoginData, 
  type RegisterData, 
  type User, 
  type Barang, 
  type Rental,
  type ApiResponse 
} from '@/services/api';

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('useLogin onSuccess called with:', data);
      
      if (data.status === 'success' && data.token) {
        console.log('Storing token and user data...');
        localStorage.setItem('auth_token', data.token);
        
        // Check if user data is in data.user or directly in data
        const userData = data.user || data.data?.user;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('User data stored:', userData);
        } else {
          console.error('No user data found in response:', data);
        }
      } else {
        console.error('Login success callback - invalid data:', data);
      }
    },
    onError: (error) => {
      console.error('useLogin onError:', error);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.status === 'success' && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      queryClient.clear();
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useTestConnection = () => {
  return useQuery({
    queryKey: ['test-connection'],
    queryFn: authService.testConnection,
  });
};

// Barang Hooks
export const useBarangs = (filters?: any) => {
  return useQuery<ApiResponse<Barang[]>>({
    queryKey: ['barangs', filters],
    queryFn: () => barangService.getAll(filters),
  });
};

export const useAvailableBarangs = (filters?: any) => {
  return useQuery<ApiResponse<Barang[]>>({
    queryKey: ['barangs-available', filters],
    queryFn: () => barangService.getAvailable(filters),
  });
};

export const useBarangCategories = () => {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ['barang-categories'],
    queryFn: barangService.getCategories,
  });
};

export const useBarang = (id: number) => {
  return useQuery<ApiResponse<Barang>>({
    queryKey: ['barang', id],
    queryFn: () => barangService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBarang = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: barangService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barangs'] });
      queryClient.invalidateQueries({ queryKey: ['barangs-available'] });
    },
  });
};

export const useUpdateBarang = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Barang> }) => 
      barangService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barangs'] });
      queryClient.invalidateQueries({ queryKey: ['barangs-available'] });
    },
  });
};

export const useDeleteBarang = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: barangService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barangs'] });
      queryClient.invalidateQueries({ queryKey: ['barangs-available'] });
    },
  });
};

// Rental Hooks
export const useRentals = (filters?: any) => {
  return useQuery<ApiResponse<Rental[]>>({
    queryKey: ['rentals', filters],
    queryFn: () => rentalService.getAll(filters),
  });
};

export const useMyRentals = (filters?: any) => {
  return useQuery<ApiResponse<Rental[]>>({
    queryKey: ['my-rentals', filters],
    queryFn: () => rentalService.getMine(filters),
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const usePendingRentals = () => {
  return useQuery<ApiResponse<Rental[]>>({
    queryKey: ['rentals-pending'],
    queryFn: rentalService.getPending,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useOngoingRentals = () => {
  return useQuery<ApiResponse<Rental[]>>({
    queryKey: ['rentals-ongoing'],
    queryFn: rentalService.getOngoing,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useCompletedRentals = () => {
  return useQuery<ApiResponse<Rental[]>>({
    queryKey: ['rentals-completed'],
    queryFn: rentalService.getCompleted,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useRental = (id: number) => {
  return useQuery<ApiResponse<Rental>>({
    queryKey: ['rental', id],
    queryFn: () => rentalService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rentalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rentals-pending'] });
    },
  });
};

export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Rental> }) => 
      rentalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
    },
  });
};

export const useUpdateRentalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string; catatan?: string } }) => 
      rentalService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rentals-pending'] });
      queryClient.invalidateQueries({ queryKey: ['rentals-ongoing'] });
      queryClient.invalidateQueries({ queryKey: ['rentals-completed'] });
    },
  });
};

// Dashboard Hooks (Manager only)
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useReportsSummary = () => {
  return useQuery({
    queryKey: ['reports-summary'],
    queryFn: dashboardService.getReportsSummary,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// User Management Hooks (Manager/Gudang only)
export const useUsers = (filters?: any) => {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ['users', filters],
    queryFn: () => userService.getAll(filters),
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useUser = (id: number) => {
  return useQuery<ApiResponse<User>>({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id && !!localStorage.getItem('auth_token'),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
