import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price?: string;
    isFree: boolean;
    url?: string;
    category: { _id: string, name: string };
    organizer: { _id: string, firstName: string, lastName: string };
}

const EventSchema = new Schema({
    title: { type: "string", required: true },
    description: { type: "string" },
    location: { type: "string" },
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: "string", required: true },
    startDateTime: { type: Date, default: Date.now },
    endDateTime: { type: Date, default: Date.now },
    price: { type: "String" },
    isFree: { type: "boolean", default: false },
    url: { type: "string" },
    category: { type: Schema.Types.ObjectId, ref: "Categoty" },
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
})

const Event = models.Event || model("Event", EventSchema);

export default Event;