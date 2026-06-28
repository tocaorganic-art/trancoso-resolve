// Tipos das entidades do Base44 usadas pela aplicação.
// Campos opcionais porque o backend é dinâmico (sem schema estrito ainda).

export interface User {
  id?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  user_type?: string;
}

export interface Subscription {
  id?: string;
  user_email?: string;
  status?: string;
  plan?: string;
  next_billing_date?: string | null;
  trial_end?: string | null;
}

export interface ServiceProvider {
  id?: string;
  full_name?: string;
  created_by?: string;
  status_verificacao?: string;
  availability?: string;
  rating?: number;
}

export interface ServiceRequest {
  id?: string;
  provider_id?: string;
  status?: string;
  date?: string;
  message?: string;
  created_date?: string;
}

export interface Transaction {
  id?: string;
  type?: string;
  status?: string;
  amount?: number;
}

export interface ServiceReview {
  id?: string;
  request_id?: string;
  created_by?: string;
}

export interface Payment {
  id?: string;
  request_id?: string;
  client_email?: string;
  status?: string;
  amount_total?: number;
  auto_capture_after?: string;
}
