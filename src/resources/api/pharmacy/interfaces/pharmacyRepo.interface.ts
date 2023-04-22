import Pharmacy from "./pharmacy.interface";


export default interface PharmacyRepositoryInterface {
    createPharmacy(data: pharmacy.Request): Promise<pharmacy.Response>
    findOne(query: findOne.Request): Promise<findOne.Response>
    find(query: any): Promise<find.Response>
    findOneAndUpdate(query: any, data: any | Pharmacy): Promise<findOneAndUpdate.Response>

}

export namespace pharmacy {
    export type Request = Omit<Pharmacy, 'id'>;
    export type Response = Pharmacy;
}

export namespace findOne {
    export type Request = Pharmacy | any;
    export type Response = Pharmacy | null;
}

export namespace find {
    export type Response = Pharmacy[] | [];
}

export namespace findOneAndUpdate {
    export type Response = Pharmacy | null;
}