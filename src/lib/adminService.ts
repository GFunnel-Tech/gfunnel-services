import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyUser, AccessItem } from './adminTypes';

// Companies
export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCompany(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Company Users
export async function getCompanyUsers(companyId: string): Promise<CompanyUser[]> {
  const { data, error } = await supabase
    .from('company_users')
    .select('*')
    .eq('company_id', companyId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addCompanyUser(user: Omit<CompanyUser, 'id' | 'created_at'>): Promise<CompanyUser> {
  const { data, error } = await supabase
    .from('company_users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompanyUser(id: string, updates: Partial<CompanyUser>): Promise<CompanyUser> {
  const { data, error } = await supabase
    .from('company_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCompanyUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('company_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Access Items
export async function getAccessItems(companyId: string): Promise<AccessItem[]> {
  const { data, error } = await supabase
    .from('access_items')
    .select('*')
    .eq('company_id', companyId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createAccessItem(item: Omit<AccessItem, 'id' | 'created_at'>): Promise<AccessItem> {
  const { data, error } = await supabase
    .from('access_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAccessItem(id: string, updates: Partial<AccessItem>): Promise<AccessItem> {
  const { data, error } = await supabase
    .from('access_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAccessItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('access_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Stats
export async function getAdminStats() {
  const [companiesRes, usersRes] = await Promise.all([
    supabase.from('companies').select('id, plan_price', { count: 'exact' }),
    supabase.from('company_users').select('id', { count: 'exact' }),
  ]);

  const totalRevenue = companiesRes.data?.reduce((sum, c) => sum + (c.plan_price || 0), 0) || 0;

  return {
    totalCompanies: companiesRes.count || 0,
    totalUsers: usersRes.count || 0,
    monthlyRevenue: totalRevenue,
  };
}
