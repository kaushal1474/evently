import { IEvent } from '@/lib/database/models/event.model'
import React from 'react'
import Card from './Card'

interface CollectionProps {
    data: IEvent[]
    emptyTitle: string
    emptyStateSubText: string
    collectionType: "Event_Organized" | "My_Tickets" | "All_Events"
    limit: number
    page: number
    totalPages?: number
    urlParamName?: string
}

const Collection = ({
    data,
    emptyTitle,
    emptyStateSubText,
    collectionType,
    limit,
    page,
    totalPages,
    urlParamName
}: CollectionProps) => {
    return (
        <>
            {data.length > 0 ?
                <div className='flex flex-col items-center gap-10'>
                    <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
                        {data.map((event) => {
                            const hasOrderLink = collectionType === "Event_Organized";
                            const hidePrice = collectionType === "My_Tickets"

                            return (
                                <li key={event.id} className='flex justify-center'>
                                    <Card
                                        event={event}
                                        hasOrderLink={hasOrderLink}
                                        hidePrice={hidePrice}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </div>
                :
                <div className='flex-center wrapper min-h-[200px] rounded-[14px] w-full flex-col gap-3 bg-grey-50 py-28 text-center'>
                    <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
                    <p className='p-regular-14'>{emptyStateSubText}</p>
                </div>
            }
        </>
    )
}

export default Collection