import FindDrugInterface, { find } from "../interfaces/usecases/find.interface";
import DrugRepositoryInterface from "../interfaces/drugRepo.interface";
import Exception from "@/utils/exception/Exception";

export default class FindDrugUsecase implements FindDrugInterface {
    constructor(private readonly DrugRepo: DrugRepositoryInterface){}
    public async execute(query: any): Promise<find.Response> {
        try {
            const results = await this.DrugRepo.find(query)

            return results
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}