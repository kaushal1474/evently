"use server"

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    
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
            success_url: `${"http://localhost:3001"}/profile`,
            cancel_url: `${"http://localhost:3001"}/events/${order.eventId}`,
        });

        redirect(session.url!)
    } catch (error) {
        throw error;
    }
}

export async function createOrder(order: CreateOrderParams) {
    try {
        await connectToDatabase()

        const newOrder = await Order.create({
            ...order,
            event: order.eventId,
            buyer: order.buyerId
        });

        return JSON.parse(JSON.stringify(newOrder));
    } catch (err) {
        handleError(err)
    }
}