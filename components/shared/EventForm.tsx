"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import DatePicker from "react-datepicker"

import { eventDefaultValues } from "@/constants"
import { eventFormSchema } from "@/lib/validator"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Dropdown from "@/components/shared/Dropdown"
import FileUploader from "@/components/shared/FileUploader"
import { useUploadThing } from "@/lib/uploadthing"
import { createEvent, updateEvent } from "@/lib/actions/event.action"

import "react-datepicker/dist/react-datepicker.css";
import { IEvent } from "@/lib/database/models/event.model"


interface IEventForm {
    userId: string;
    type: "create" | "update";
    event?: IEvent
}

const EventForm = ({ userId, type, event }: IEventForm) => {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("imageUploader");
    const router = useRouter();

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: type === "update" && event ?
            {
                ...event,
                startDateTime: new Date(event.startDateTime),
                endDateTime: new Date(event.endDateTime),
                categoryId: event.category._id
            }
            : eventDefaultValues,
    })


    async function onSubmit(values: z.infer<typeof eventFormSchema>) {


        let uploadImageUrl = values.imageUrl
        if (files.length > 0) {
            const uploadImages = await startUpload(files);

            if (!uploadImages) {
                return
            }
            uploadImageUrl = uploadImages[0].url
        }

        if (type === "create") {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadImageUrl },
                    userId: userId,
                    path: "/profile"
                })

                if (newEvent) {
                    form.reset();
                    router.push(`/events/${newEvent._id}`)
                }

            } catch (e) {
                console.error(e);
            }
        }
        if (type === "update") {
            if (!event?._id) {
                router.back();
                return
            }
            try {
                const updatedEvent = await updateEvent({
                    event: { ...values, imageUrl: uploadImageUrl, _id: event._id },
                    userId: userId,
                    path: `/events/${event._id}`
                })

                if (updatedEvent) {
                    form.reset();
                    router.push(`/events/${updatedEvent._id}`)
                }

            } catch (e) {
                console.error(e);
            }
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Dropdown onValueChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <Textarea placeholder="Event Description" {...field} className="textarea rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <FileUploader
                                        onFieldChane={field.onChange}
                                        imageUrl={field.value}
                                        setFiles={setFiles}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 bg-gray-50">
                                        <Image
                                            src="/assets/icons/location-grey.svg"
                                            alt="Location" height={24} width={24}
                                        />
                                        <Input placeholder="Event location or online" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 bg-gray-50">
                                        <Image
                                            src="/assets/icons/calendar.svg"
                                            alt="calendar" height={24} width={24}
                                            className="filter-grey"
                                        />
                                        <p className="ml-3 whitespace-nowrap text-gray-600">Start Date</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time:"
                                            dateFormat={"MMM dd, yyyy h:mm:ss"}
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 bg-gray-50">
                                        <Image
                                            src="/assets/icons/calendar.svg"
                                            alt="calendar" height={24} width={24}
                                            className="filter-grey"
                                        />
                                        <p className="ml-3 whitespace-nowrap text-gray-600">End Date</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time:"
                                            dateFormat={"MMM dd, yyyy h:mm:ss"}
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 bg-gray-50">
                                        <Image
                                            src="/assets/icons/dollar.svg"
                                            alt="dollar" height={24} width={24}
                                        />
                                        <Input type="number" placeholder="Price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />

                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free ticket</label>
                                                            <Checkbox id="isFree" className="mr-2"
                                                                onCheckedChange={field.onChange}
                                                                checked={field.value}
                                                            />

                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 bg-gray-50">
                                        <Image
                                            src="/assets/icons/link.svg"
                                            alt="link" height={24} width={24}
                                        />
                                        <Input placeholder="Url" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full buttom col-span-2 capitalize">
                    {form.formState.isSubmitting ? "Submitting" : `${type} Event`}
                </Button>

            </form>
        </Form>
    )
}

export default EventForm