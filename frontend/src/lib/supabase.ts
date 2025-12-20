import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://64.177.81.23:8000';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Clase {
    id: number;
    tema: string;
    contenido: string;
    modelo: string;
    tokens_usados: number;
    created_at: string;
}

export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    nivel: 'primaria' | 'secundaria' | 'ambos';
    progreso: Record<string, number>;
    created_at: string;
}

// Helper functions
export async function getClases(limit = 50) {
    const { data, error } = await supabase
        .from('clases_generadas')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data as Clase[];
}

export async function getClaseById(id: number) {
    const { data, error } = await supabase
        .from('clases_generadas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Clase;
}

export async function searchClases(query: string) {
    const { data, error } = await supabase
        .from('clases_generadas')
        .select('*')
        .ilike('tema', `%${query}%`)
        .limit(20);

    if (error) throw error;
    return data as Clase[];
}

// Auth helpers
export async function signUp(email: string, password: string, nombre: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { nombre }
        }
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
