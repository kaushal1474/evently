"use server"

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import { connectToDatabase } from "../database";
import Event from "../database/models/event.model";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";
import { revalidatePath } from "next/cache";

const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

export const populateEvent = async (query: any) => {
    return query
        .populate({ path: "organizer", model: User, select: "_id firstName lastName" })
        .populate({ path: "category", model: Category, select: "_id name" })
}

export async function createEvent(userData: CreateEventParams) {
    try {
        await connectToDatabase();

        const organizer = await User.findById(userData.userId);
        if (!organizer) {
            throw new Error("Organizer not found");
        }

        const newEvent = await Event.create({
            ...userData.event,
            category: userData.event.categoryId,
            organizer: userData.userId
        });

        return JSON.parse(JSON.stringify(newEvent));

    } catch (err) {
        handleError(err)
    }
}

export const getEventById = async (eventId: string) => {
    try {
        await connectToDatabase();
        const event = await populateEvent(Event.findById(eventId));

        if (!event) {
            throw new Error("Event not found");
        }

        return JSON.parse(JSON.stringify(event));


    } catch (err) {
        handleError(err)
    }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
        await connectToDatabase()

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
            // $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }

        const skipAmount = 0; // (Number(page) - 1) * limit
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
        await connectToDatabase()

        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        handleError(error)
    }
}


// Delete event
export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
    const eventToDelete = await Event.findOne({ eventId })

    const deletedEvent = await User.findByIdAndDelete(eventToDelete._id)
    if (!deletedEvent) return revalidatePath(path)
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
        await connectToDatabase()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}