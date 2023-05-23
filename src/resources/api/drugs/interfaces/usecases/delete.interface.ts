import Drug from "../drug.interface";

export default interface DeleteDrugInterface {
    execute(userId: string, ...data: deleteDoc.Request[]): Promise<deleteDoc.Response>
}

interface Res {
    insertedCount: number,
    matchedCount: number,
    modifiedCount: number,
    deletedCount: number,
}

export namespace deleteDoc {
    export type Request = string
    export type Response = Res;
}