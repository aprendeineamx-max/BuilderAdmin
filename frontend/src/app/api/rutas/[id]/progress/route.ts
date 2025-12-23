import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// API para obtener el progreso de una ruta específica para el usuario actual
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const rutaId = parseInt(params.id);

    // Get path progress
    const { data: progress, error: progressError } = await supabase
        .from('path_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('ruta_id', rutaId)
        .single();

    if (progressError && progressError.code !== 'PGRST116') {
        return NextResponse.json({ error: progressError.message }, { status: 500 });
    }

    // If no progress exists, return empty state
    if (!progress) {
        return NextResponse.json({
            user_id: user.id,
            ruta_id: rutaId,
            completed_courses: [],
            total_courses: 0,
            completion_percentage: 0,
            completed_at: null
        });
    }

    return NextResponse.json(progress);
}

// API para actualizar progreso (cuando un usuario completa un curso)
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const rutaId = parseInt(params.id);
    const body = await request.json();
    const { completed_course_id } = body;

    if (!completed_course_id) {
        return NextResponse.json({ error: "course_id requerido" }, { status: 400 });
    }

    // Get current progress
    const { data: currentProgress } = await supabase
        .from('path_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('ruta_id', rutaId)
        .single();

    let completedCourses = currentProgress?.completed_courses || [];

    // Add course if not already completed
    if (!completedCourses.includes(completed_course_id)) {
        completedCourses.push(completed_course_id);
    }

    // Get total courses in this ruta
    const { count: totalCourses } = await supabase
        .from('ruta_cursos')
        .select('*', { count: 'exact', head: true })
        .eq('ruta_id', rutaId);

    const percentage = totalCourses ? Math.floor((completedCourses.length / totalCourses) * 100) : 0;

    // Upsert progress
    const { data: updatedProgress, error: updateError } = await supabase
        .from('path_progress')
        .upsert({
            user_id: user.id,
            ruta_id: rutaId,
            completed_courses: completedCourses,
            total_courses: totalCourses || 0,
            completion_percentage: percentage
        }, {
            onConflict: 'user_id,ruta_id'
        })
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedProgress);
}
