"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, Badge, Card } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Activity {
    id: number;
    action_type: string;
    metadata: any;
    created_at: string;
    profiles: {
        full_name: string;
        username: string;
        avatar_url: string;
    };
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();

        // Subscription for real-time updates
        const channel = supabase
            .channel('public:activity_log')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' },
                payload => {
                    // Fetch full profile data for the new activity
                    // For simplicity, re-fetch or optimistically add if we had the profile.
                    fetchActivity();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchActivity = async () => {
        const { data, error } = await supabase
            .from("activity_log")
            .select(`
                *,
                profiles:user_id (full_name, username, avatar_url)
            `)
            .order("created_at", { ascending: false })
            .limit(20);

        if (data) setActivities(data as any); // Type assertion for joined data
        setLoading(false);
    };

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'completed_class': return '🎓';
            case 'earned_badge': return '🏆';
            case 'published_contribution': return '💡';
            default: return '📢';
        }
    };

    const getActionText = (activity: Activity) => {
        const { action_type, metadata } = activity;
        switch (action_type) {
            case 'completed_class':
                return <span>completó la clase <strong>{metadata?.title}</strong></span>;
            case 'earned_badge':
                return <span>ganó la insignia <strong>{metadata?.badge_name}</strong></span>;
            case 'published_contribution':
                return <span>publicó un aporte: <strong>{metadata?.title}</strong></span>;
            default:
                return <span>hizo algo genial</span>;
        }
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="text-gray-500 text-center py-4">Cargando actividad...</div>
            ) : activities.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No hay actividad reciente.</div>
            ) : (
                activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-white/5 animate-slide-in">
                        <Avatar name={activity.profiles?.full_name || "U"} size="sm" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">
                                <span className="font-bold text-white mr-1">{activity.profiles?.full_name}</span>
                                {getActionText(activity)}
                            </p>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                {getActionIcon(activity.action_type)}
                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: es })}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
