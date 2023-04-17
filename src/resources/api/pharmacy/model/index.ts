import {Schema, model} from 'mongoose'
import Pharmacy from '../interfaces/pharmacy.interface'


const pharmacySchema = new Schema<Pharmacy> ({
    name: {
        type: String,
        required: [true, 'please provide the pharmacy name']
    },
    type: String,
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'This pharmacy must belong to a user']
    },
    phone_number: String,
    motto: String,
    address: String,
    location: {
        type: {
                type: String,
                enum: "Point",
                required: true,
            },
        coordinates: {
                type: [Number],
                required: true,
            }
    },
    license_number: String,
    pharmacistLicense: String,
    pharmacistQualification: String,
    email: String,
    description: String,
    images: [String],
    verified: {
        type: Boolean,
        default: false
    }
})

export default model('PharmacyModel', pharmacySchema)