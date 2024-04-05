"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

type PaginationProps = {
    page: number | string,
    urlParamName: string,
    // limit,
    totalPages: number,
}
const Pagination = ({
    urlParamName,
    // limit,
    page,
    totalPages
}: PaginationProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const onClick = (type: "prev" | "next") => {

        const pageNumber = type === "prev" ? +page - 1 : +page + 1;

        let newUrl;
        if (pageNumber > 1) {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: urlParamName || "page",
                value: String(pageNumber)
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: [urlParamName, "page"]
            })
        }

        router.push(newUrl, { scroll: false })
    }

    return (
        <div className='flex gap-2'>
            <Button
                variant={'outline'}
                className='w-28'
                onClick={() => onClick("prev")}
                disabled={+page <= 1}
            >
                Previous
            </Button>
            <Button
                variant={'outline'}
                className='w-28'
                onClick={() => onClick("next")}
                disabled={+page >= totalPages}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination