export default interface Pharmacy {
    id?: string,
    pharmacistLicense?: string,
    pharmacistQualification?: string,
    name: string,
    slug?: string,
    type?: string,
    userId?: string,
    phone_number?: string,
    motto?: string,
    license_number?: string,
    address?: string,
    location?: Location,
    email?: string,
    description?: string,
    images?: string[],
    created_at?: Date,
    updated_at?: Date
    verified?: boolean
}

interface Location {
    type: string,
    coordinates: number[]
}