import { Schema, model } from "mongoose";
import User, {Role} from "../interfaces/user.interface";


const userSchema = new Schema<User> ({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [Role.Pharmacist, Role.User]
    }
})

export default model('User', userSchema)