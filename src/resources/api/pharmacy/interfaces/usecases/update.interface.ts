import Pharmacy from "../pharmacy.interface";

export default interface UpdateInterface {
    execute(query: any, userId: string, data: Update.Request): Promise<Update.Response>
}

export namespace Update {
    export type Request = Omit<Pharmacy, 'id' | 'created_at' | 'updated_at' | 'verified'>
    export type Response = Pharmacy
}