import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';

// Get the URL from environment or use default
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bxiieunzrcdbxqadapcl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWlldW56cmNkYnhxYWRhcGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTAzMTIsImV4cCI6MjA2NDQ2NjMxMn0.87x8KfKhfQoJlmbBg1I1zHwEMIE-Uvk-THCFmEn-n6E';

export const createServer = () => {
  try {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({ 
      cookies: () => cookieStore,
      options: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey
      }
    });
  } catch (error) {
    console.error('Error creating server client:', error);
    // Return a dummy client during build time
    if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_ENV) {
      return {
        auth: {
          getSession: async () => ({ data: { session: null } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      } as any;
    }
    throw error;
  }
};

export const createRoute = () => {
  try {
    const cookieStore = cookies();
    return createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore,
      options: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey
      }
    });
  } catch (error) {
    console.error('Error creating route handler client:', error);
    // Return a dummy client during build time
    if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_ENV) {
      return {
        auth: {
          getSession: async () => ({ data: { session: null } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      } as any;
    }
    throw error;
  }
};