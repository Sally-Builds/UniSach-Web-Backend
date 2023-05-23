import Drug from "../drug.interface";

export default interface FindDrugInterface {
    execute(query: any): Promise<find.Response>
}

export namespace find {
    export type Response = Drug[] | [];
}