import DrugRepositoryInterface from "../interfaces/drugRepo.interface";
import Exception from "@/utils/exception/Exception";
import FindOneDrugInterface, { findOne } from "../interfaces/usecases/findOne.interface";

export default class FindOneDrugUsecase implements FindOneDrugInterface {
    constructor(private readonly DrugRepo: DrugRepositoryInterface){}
    public async execute(id: string): Promise<findOne.Response> {
        try {
            const result = await this.DrugRepo.findOne({_id: id})

            if(!result) throw new Exception('not found', 400)

            return result;
            
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}