"use server"

import { CreateEventParams } from "@/types";
import { connectToDatabase } from "../database";
import Event from "../database/models/event.model";
import { handleError } from "../utils";
import User from "../database/models/user.model";

export async function createEvent(userData: CreateEventParams) {
    console.log(userData);
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