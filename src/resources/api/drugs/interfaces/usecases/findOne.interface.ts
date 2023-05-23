import Drug from "../drug.interface";

export default interface FindOneDrugInterface {
    execute(id: findOne.Request): Promise<findOne.Response>
}

export namespace findOne {
    export type Request = string;
    export type Response = Drug;
}