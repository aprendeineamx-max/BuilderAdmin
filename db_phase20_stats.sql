-- Phase 20: Enterprise Stats Function

CREATE OR REPLACE FUNCTION get_organization_stats(org_id_input UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT json_build_object(
        'total_members', (SELECT COUNT(*) FROM public.organization_members WHERE organization_id = org_id_input),
        'license_limit', (SELECT license_limit FROM public.organizations WHERE id = org_id_input),
        'active_students', (
            SELECT COUNT(DISTINCT user_id) 
            FROM public.clases_progreso 
            WHERE user_id IN (
                SELECT user_id FROM public.organization_members WHERE organization_id = org_id_input
            )
            AND updated_at > NOW() - INTERVAL '30 days'
        ),
        'average_progress', (
            SELECT COALESCE(AVG(progreso_total), 0)
            FROM (
                SELECT COUNT(*) as progreso_total
                FROM public.clases_progreso
                WHERE user_id IN (
                    SELECT user_id FROM public.organization_members WHERE organization_id = org_id_input
                )
                AND completado = true
                GROUP BY user_id
            ) as sub
        )
    ) INTO result;

    RETURN result;
END;
$$;
