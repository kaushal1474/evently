import { startTransition, useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

import { ICategory } from "@/lib/database/models/category.model"
import { createCategory, getAllCategory } from "@/lib/actions/category.action";


interface DropdownProps {
    value: string,
    onValueChange?: () => void
}

const Dropdown = ({ onValueChange, value }: DropdownProps) => {
    const [newCategory, setNewCategory] = useState("");
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {

        getAllCategory().then((data: ICategory[]) => data && setCategories(data));
    }, [])

    const handleAddCategory = () => {
        createCategory({
            categoryName: newCategory.trim()
        })
            .then((data) => setCategories(prev => [...prev, data]));
    }

    return (
        <Select onValueChange={onValueChange} value={value}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                {categories.length > 0 &&
                    categories.map((category) =>
                        <SelectItem key={category._id} value={category._id} className="select-item p-regular-14">{category.name}</SelectItem>
                    )
                }
                <AlertDialog>
                    <AlertDialogTrigger
                        className="p-medium-14 flex w-full pl-8 py-3 rounded-sm text-primary-500 hover:bg-primary-50 focus:text-primary-500"
                    >
                        Add New Category
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input
                                    placeholder="Category Name"
                                    className="input-field mt-3"
                                    onChange={e => setNewCategory(e.target.value)}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => startTransition(handleAddCategory)}
                            >
                                Add
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SelectContent>
        </Select>
    )
}

export default Dropdown