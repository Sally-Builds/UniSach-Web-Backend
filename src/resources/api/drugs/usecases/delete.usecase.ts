import DeleteDrugInterface, { deleteDoc } from "../interfaces/usecases/delete.interface";
import PharmacyRepositoryInterface from "../../pharmacy/interfaces/pharmacyRepo.interface";
import DrugRepositoryInterface from "../interfaces/drugRepo.interface";
import Exception from "@/utils/exception/Exception";

export default class DeleteDrugUsecase implements DeleteDrugInterface {
    constructor(private readonly DrugRepo: DrugRepositoryInterface, private readonly PharmRepo: PharmacyRepositoryInterface){}
    public async execute(userId: string, ...data: deleteDoc.Request[]): Promise<deleteDoc.Response> {
        try {
            const newData: any = []

            data.forEach(async (el: deleteDoc.Request) => {
                const pharmacy = await this.PharmRepo.findOne({_id: el})

                if(pharmacy && pharmacy.userId === userId) {
                    newData.push({el, pharmacy: (pharmacy.id as string)})
                }
            })

            const result = await this.DrugRepo.deleteDoc(...newData)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}