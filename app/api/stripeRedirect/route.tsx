import Stripe from 'stripe';
import { NextResponse } from 'next/server'
import { CheckoutOrderParams } from '@/types';

export async function POST(request: Request) {


    const url = new URL(request.url).origin;
    const order: CheckoutOrderParams = await request.json();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const price = order.isFree ? 0 : Number(order.price) * 100;

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle
                        }
                    },
                    quantity: 1
                },
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId,
            },
            mode: 'payment',
            success_url: `${url}/profile`,
            cancel_url: `${url}/events/${order.eventId}`,
        });

        return NextResponse.json({ message: 'OK', redirect: session.url! })
    } catch (error) {
        throw error;
    }

}