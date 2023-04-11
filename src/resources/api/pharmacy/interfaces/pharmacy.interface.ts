import { Document, ObjectId } from "mongoose"

export default interface Pharmacy extends Document {
    id?: string,
    pharmacistLicense?: string,
    pharmacistQualification?: string,
    name: string,
    type?: string,
    userId: ObjectId,
    phone_number?: string,
    motto?: string,
    license_number?: string,
    address?: string,
    location?: Location,
}

interface Location {
    type: string,
    coordinates: number[]
}