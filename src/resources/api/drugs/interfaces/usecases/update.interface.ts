import Drug from "../drug.interface";

export default interface UpdateDrugInterface {
    execute(userId: string, ...data: updateDoc.Request[]): Promise<updateDoc.Response>
}


interface Res {
    insertedCount: number,
    matchedCount: number,
    modifiedCount: number,
    deletedCount: number,
}


export namespace updateDoc {
    export type Request = Drug;
    export type Response = Res;
}