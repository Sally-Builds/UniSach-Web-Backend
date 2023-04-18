import Pharmacy from "../pharmacy.interface";

export default interface GetAllInterface {
    execute(query: any): Promise<Get.Response>
}

export namespace Get {
    export type Response = Pharmacy[] | []
}