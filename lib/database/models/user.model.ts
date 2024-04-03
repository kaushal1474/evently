import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: { type: "string", unique: true, required: true },
    email: { type: "string", unique: true, required: true },
    username: { type: "string", unique: true, required: true },
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    photo: { type: "string", required: true },
})

const User = models.User || model("User", UserSchema);

export default User;