import GetAllInterface, { Get } from "../interfaces/usecases/getAll.interface";
import PharmacyRepositoryInterface from "../interfaces/pharmacyRepo.interface";
import Exception from "@/utils/exception/Exception";


export default class GetAllPharmacyUsecase implements GetAllInterface {

    constructor(private readonly PharmRepo: PharmacyRepositoryInterface) {}

    async execute(query: any): Promise<Get.Response> {
        try {
            const pharmacies = await this.PharmRepo.find(query);

            return pharmacies
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}