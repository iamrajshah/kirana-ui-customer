export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  tenant_id?: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email?: string;
  password: string;
  tenant_id?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    customer: Customer;
  };
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: Customer;
}
