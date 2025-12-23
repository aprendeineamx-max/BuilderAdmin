import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// API route server-side - evita CORS y Mixed Content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, apellido, email, password, nivel } = body;

        if (!email || !password || !nombre || !apellido) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos" },
                { status: 400 }
            );
        }

        // Crear cliente Supabase server-side (usando localhost ya que estamos en el servidor)
        const supabase = createClient(
            'http://localhost:8000',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Intentar registrar usuario
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: `${nombre} ${apellido}`,
                    nivel
                }
            }
        });

        if (signUpError) {
            console.error('Supabase signup error:', signUpError);

            // Mensajes de error personalizados
            if (signUpError.message.includes('already registered')) {
                return NextResponse.json(
                    { error: "Este correo ya está registrado. Intenta iniciar sesión." },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: signUpError.message || "Error al crear la cuenta" },
                { status: 400 }
            );
        }

        // Éxito
        return NextResponse.json({
            success: true,
            user: data.user,
            session: data.session,
            message: data.session
                ? "Cuenta creada exitosamente"
                : "Cuenta creada. Revisa tu correo para confirmar."
        });

    } catch (err) {
        console.error('API register error:', err);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
