import Pharmacy from "../pharmacy.interface";


export default interface CreateInterface {
    execute(data: Create.Request): Promise<Create.Response>
}

export namespace Create {
    export type Request = Omit<Pharmacy, "id">
    export type Response = Pharmacy
}