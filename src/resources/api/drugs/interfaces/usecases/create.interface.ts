import Drug from "../drug.interface";

export default interface CreateDrugInterface {
    execute(userId: string, ...data: create.Request[]): Promise<create.Response>
}

export namespace create {
    export type Request = Omit<Drug, 'id' | 'slug'>;
    export type Response = Drug[];
}