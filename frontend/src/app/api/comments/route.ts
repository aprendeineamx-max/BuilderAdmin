import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtener comentarios de una clase
export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { searchParams } = new URL(request.url);
    const claseId = searchParams.get('clase_id');

    if (!claseId) {
        return NextResponse.json({ error: "clase_id requerido" }, { status: 400 });
    }

    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles:user_id (full_name, avatar_url, username)
        `)
        .eq('clase_id', claseId)
        .is('parent_id', null) // Solo comentarios raíz
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
            const { data: replies } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles:user_id (full_name, avatar_url, username)
                `)
                .eq('parent_id', comment.id)
                .order('created_at', { ascending: true });

            return { ...comment, replies: replies || [] };
        })
    );

    return NextResponse.json(commentsWithReplies);
}

// POST: Crear un nuevo comentario
export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { clase_id, content, parent_id } = body;

    if (!clase_id || !content) {
        return NextResponse.json({ error: "clase_id y content requeridos" }, { status: 400 });
    }

    const { data: newComment, error } = await supabase
        .from('comments')
        .insert({
            clase_id: parseInt(clase_id),
            user_id: user.id,
            content,
            parent_id: parent_id || null
        })
        .select(`
            *,
            profiles:user_id (full_name, avatar_url, username)
        `)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newComment, { status: 201 });
}
