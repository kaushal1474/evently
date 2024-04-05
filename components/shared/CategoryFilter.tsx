"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAllCategory } from "@/lib/actions/category.action";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const CategoryFilter = () => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {

        getAllCategory().then((data: ICategory[]) => data && setCategories(data));
    }, [])

    function onSelectCategory(category: string) {
        let newUrl = ""
        if (category && category !== "All") {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "category",
                value: category
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ["category"]
            })
        }
        router.push(newUrl, { scroll: false })
    }


    return (
        <div className='w-full'>
            <Select onValueChange={onSelectCategory}>
                <SelectTrigger className="select-field">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"All"} className="select-item p-regular-14">All Categories</SelectItem>

                    {categories.length > 0 &&
                        categories.map((category) =>
                            <SelectItem key={category._id} value={category.name} className="select-item p-regular-14 capitalize">{category.name}</SelectItem>
                        )
                    }
                </SelectContent>
            </Select>

        </div>
    )
}

export default CategoryFilter