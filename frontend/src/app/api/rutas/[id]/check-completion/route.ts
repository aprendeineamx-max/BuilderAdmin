import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// API para verificar si el usuario completó la ruta y emitir certificado automáticamente
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role para bypass RLS
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const rutaId = parseInt(params.id);

    // Check progress
    const { data: progress } = await supabase
        .from('path_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('ruta_id', rutaId)
        .single();

    if (!progress) {
        return NextResponse.json({
            completed: false,
            message: "No hay progreso registrado"
        });
    }

    // Check if already 100%
    if (progress.completion_percentage < 100) {
        return NextResponse.json({
            completed: false,
            percentage: progress.completion_percentage,
            message: `Progreso: ${progress.completion_percentage}%`
        });
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
        .from('path_certificates')
        .select('*')
        .eq('student_id', user.id)
        .eq('ruta_id', rutaId)
        .single();

    if (existingCert) {
        return NextResponse.json({
            completed: true,
            certificate_exists: true,
            certificate_id: existingCert.id,
            message: "Certificado ya emitido"
        });
    }

    // Get ruta name
    const { data: ruta } = await supabase
        .from('rutas')
        .select('name')
        .eq('id', rutaId)
        .single();

    // Issue certificate
    const { data: newCert, error: certError } = await supabase
        .from('path_certificates')
        .insert({
            student_id: user.id,
            ruta_id: rutaId,
            ruta_name: ruta?.name || 'Ruta Completada',
            issued_at: new Date().toISOString()
        })
        .select()
        .single();

    if (certError) {
        return NextResponse.json({ error: certError.message }, { status: 500 });
    }

    return NextResponse.json({
        completed: true,
        certificate_exists: false,
        certificate_id: newCert.id,
        certificate_code: newCert.validation_code,
        message: "¡Felicidades! Certificado emitido"
    });
}
