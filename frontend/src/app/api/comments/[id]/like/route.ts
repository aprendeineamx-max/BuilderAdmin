import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// POST: Toggle like en un comentario
export async function POST(
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

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('comment_id', commentId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Decrement counter
        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });

        return NextResponse.json({ liked: false, message: "Like removido" });
    } else {
        // Like
        const { error } = await supabase
            .from('comment_likes')
            .insert({
                user_id: user.id,
                comment_id: commentId
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Increment counter
        await supabase.rpc('increment_comment_likes', { comment_id: commentId });

        return NextResponse.json({ liked: true, message: "Like agregado" });
    }
}
