import DrugRepositoryInterface from "../interfaces/drugRepo.interface";
import CreateDrugInterface, { create } from "../interfaces/usecases/create.interface";
import PharmacyRepositoryInterface from "../../pharmacy/interfaces/pharmacyRepo.interface";
import Exception from "@/utils/exception/Exception";


export default class CreateDrugUsecase implements CreateDrugInterface {
    constructor(private readonly drugRepo: DrugRepositoryInterface, private readonly pharmRepo: PharmacyRepositoryInterface){}

    public async execute(userId: string, ...data: create.Request[]): Promise<create.Response> {
        try {
            const pharmacy = await this.pharmRepo.findOne({userId})
            if(!pharmacy) throw new Exception('Forbidden', 403)

            const newData = data.map(el => {
                return {...el, pharmacy: pharmacy.id}
            })
            const results = await this.drugRepo.create(...newData)

            return results
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}