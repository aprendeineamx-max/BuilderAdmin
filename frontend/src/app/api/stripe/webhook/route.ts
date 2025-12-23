import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId) {
            return new NextResponse("User ID missing in metadata", { status: 400 });
        }

        // Update User Subscription in DB
        const { error } = await supabase.from('subscriptions').insert({
            user_id: userId,
            plan_id: 'pro', // Simplified logic
            status: 'active',
            provider: 'stripe',
            provider_subscription_id: subscriptionId,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Mock logic, ideally fetch sub details
        });

        if (error) console.error("DB Error:", error);
    }

    if (event.type === "invoice.payment_succeeded") {
        // Extend subscription logic here
    }

    return new NextResponse(null, { status: 200 });
}
