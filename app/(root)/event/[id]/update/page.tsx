import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.action';
import { SearchParamProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const UpdateEvent = async({ params: { id }, }: SearchParamProps) => {
    const { sessionClaims } = auth();
    const eventData = await getEventById(id);
    
    const userId = sessionClaims?.userId as string;
    if (eventData.organizer._id !== userId.toString()) {
        return redirect("/")
    }
    
    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className="wrapper h3-bold text-center sm:text-left">
                    Update Event
                </h3>
            </section>
            <div className='wrapper my-8'>
                <EventForm userId={userId} type="update" event={eventData} />
            </div>
        </>
    )
}

export default UpdateEvent