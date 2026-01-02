import { axiosInstance } from './client';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  ProfileResponse 
} from '@/types/auth';

export const authApi = {
  /**
   * Register new customer
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/customer-auth/register',
      { ...data, tenant_id: data.tenant_id || '1' }
    );
    return response.data;
  },

  /**
   * Login customer
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/customer-auth/login',
      { ...data, tenant_id: data.tenant_id || '1' }
    );
    return response.data;
  },

  /**
   * Get current customer profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosInstance.get<ProfileResponse>('/customer-auth/me');
    return response.data;
  },
};
