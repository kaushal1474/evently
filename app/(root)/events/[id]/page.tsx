import Image from 'next/image';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.action';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import Collection from '@/components/shared/Collection';
import CheckoutButton from '@/components/shared/CheckoutButton';

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
    const eventData = await getEventById(id);

    const relatedEvents = await getRelatedEventsByCategory({
        categoryId: eventData.category._id,
        eventId: eventData._id,
        page: searchParams.page as string,
    })

    return (
        <>
            <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
                <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
                    <Image
                        src={eventData.imageUrl}
                        alt="event Image"
                        height={1000} width={1000}
                        className="h-full min-h-[300px] object-cover object-center"
                    />

                    <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
                        <div className='flex flex-col gap-6'>
                            <h2 className='h2-bold'>{eventData.title}</h2>
                            <div className='flex flex-col sm:flex-row gap-3 sm:items-center'>
                                <div className='flex gap-3'>
                                    <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>
                                        {eventData.isFree ? "Free" : `$${eventData.price}`}
                                    </p>
                                    <p className='p-medium-15 rounded-full bg-grey-500/10 px-4 py-2.5 text-gray-500'>{eventData.category.name}</p>
                                </div>
                                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                                    by{" "}
                                    <span className='text-primary-500'>{eventData.organizer.firstName} {eventData.organizer.lastName}</span>
                                </p>
                            </div>
                        </div>

                        <CheckoutButton event={eventData} />

                        <div className='flex flex-col gap-5'>
                            <div className="flex gap-2 md:gap-3">
                                <Image src="/assets/icons/calendar.svg" alt="calendar"
                                    width={32} height={32}
                                />
                                <div className='p-medium-16 lg:p-redular-20 flex flex-wrap items-center gap-x-2'>
                                    <p>
                                        {formatDateTime(eventData.startDateTime).dateOnly} - {" "}
                                        {formatDateTime(eventData.startDateTime).timeOnly}
                                    </p>
                                    <b>to</b>
                                    <p>
                                        {formatDateTime(eventData.endDateTime).dateOnly} - {""}
                                        {formatDateTime(eventData.endDateTime).timeOnly}
                                    </p>
                                </div>
                            </div>
                            <div className='p-regular-20 flex items-center gap-2'>
                                <Image src="/assets/icons/location.svg"
                                    alt="location"
                                    width={32} height={32}
                                />

                                <p className='p-meduim-16 lg:p-regular-20'>
                                    {eventData.location}
                                </p>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <p className='p-bold-20 text-grey-600'>
                                    What you'll learn?
                                </p>

                                <p className='p-meduim-16 lg:p-regular-18'>
                                    {eventData.description}
                                </p>
                                <p className='p-meduim-16 lg:p-regular-18 truncate text-primary-500 underline'>
                                    {eventData.url}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
                <h2 className='h2-bold'>Related events</h2>
                <Collection
                    data={relatedEvents?.data}
                    emptyTitle={"No events found"}
                    emptyStateSubText="Come back later"
                    collectionType="All_Events"
                    limit={6}
                    page={1}
                    totalPages={2}
                />
            </section>
        </>
    )
}

export default EventDetails