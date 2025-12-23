import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Eliminar comentario (solo autor)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const commentId = parseInt(params.id);

    // Verify ownership
    const { data: comment } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

    if (!comment || comment.user_id !== user.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Comentario eliminado" });
}
