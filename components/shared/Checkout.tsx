import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '../ui/button'
import { IEvent } from '@/lib/database/models/event.model'
import { checkoutOrder } from '@/lib/actions/order.actions';
import { redirect } from 'next/navigation';

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutProps = {
    event: IEvent,
    userId: string
}


const Checkout = ({ event, userId }: CheckoutProps) => {

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
    }, []);

    const onCheckout = async () => {
        const order = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price,
            isFree: event.isFree,
            buyerId: userId
        }

        const result = await fetch("/api/stripeRedirect",
            {
                body: JSON.stringify(order),
                method: "POST",
            })

        const data = await result.json();
        if (data.message === "OK") {
            redirect(data.redirect)
        }

        // await checkoutOrder(order);
    }

    return (
        <form action={onCheckout} method='post'>
            <Button type='submit' role='link' className='button sm:w-fit'>
                {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
            </Button>
        </form>
    )
}

export default Checkout