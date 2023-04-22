export default interface Drug {
    id?: string,
    category?: string,
    name: string,
    slug?: string,
    description?: string,
    images?: string[],
    amount?: number,
    price?: number,
    pharmacyId?: string,
    created_at?: Date,
    updated_at?: Date,
}