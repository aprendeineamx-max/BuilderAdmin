#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configuración CORRECTA de Supabase (apuntando al container Docker)
const SUPABASE_URL = 'http://localhost:8000'; // URL del Kong Gateway de Supabase
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vGuTDw7dBJbvZ4S0I';

async function createUser() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log('Creando usuario: feel-widow-curler@duck.com');

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email: 'feel-widow-curler@duck.com',
            password: 'Afrodita!35',
            email_confirm: true, // Auto-confirmar email
            user_metadata: {
                full_name: 'Hola Mundo',
                nivel: 'secundaria'
            }
        });

        if (error) {
            console.error('Error creando usuario:', error);
            process.exit(1);
        }

        console.log('✅ Usuario creado exitosamente!');
        console.log('ID:', data.user.id);
        console.log('Email:', data.user.email);
        console.log('Confirmado:', data.user.email_confirmed_at ? 'Sí' : 'No');

    } catch (err) {
        console.error('Error inesperado:', err);
        process.exit(1);
    }
}

createUser();
