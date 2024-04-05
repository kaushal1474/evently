import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.action'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Profile = async ({ searchParams }: SearchParamProps) => {

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.eventsPage) || 1;

    const orders = await getOrdersByUser({ userId, page: ordersPage });
    const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

    return (
        <main>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href="/#events">Explore more events</Link>
                    </Button>
                </div>
            </section>
            <section className='wrapper my-8'>
                <Collection
                    data={orders?.data?.map((order: IOrder) => order.event) || []}
                    emptyTitle={"No events tickets purchaed yet"}
                    emptyStateSubText="No worries!! plenty of events to explore"
                    collectionType="My_Tickets"
                    urlParamName='ordersPage'
                    limit={3}
                    page={ordersPage}
                    totalPages={orders?.totalPages}
                />
            </section>

            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href="/event/create">Create new event</Link>
                    </Button>
                </div>
            </section>
            <section className='wrapper my-8'>
                <Collection
                    data={organizedEvents?.data || []}
                    emptyTitle={"No events created yet"}
                    emptyStateSubText="go create some new!!"
                    collectionType="Event_Organized"
                    urlParamName='eventsPage'
                    limit={6}
                    page={eventsPage}
                    totalPages={organizedEvents?.totalPages}
                />
            </section>
        </main>
    )
}

export default Profile