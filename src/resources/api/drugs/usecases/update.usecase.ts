import UpdateDrugInterface, { updateDoc } from "../interfaces/usecases/update.interface";
import PharmacyRepositoryInterface from "../../pharmacy/interfaces/pharmacyRepo.interface";
import DrugRepositoryInterface from "../interfaces/drugRepo.interface";
import Exception from "@/utils/exception/Exception";
import slugify from "slugify";


export default class UpdateDrugUsecase implements UpdateDrugInterface {
    constructor(private readonly DrugRepo: DrugRepositoryInterface, private readonly PharmRepo: PharmacyRepositoryInterface) {}
    public async execute(userId: string, ...data: updateDoc.Request[]): Promise<updateDoc.Response> {
        try {
            // const newData:updateDoc.Request[] = []
            
            const pharmacy = await this.PharmRepo.findOne({userId})
            const newData:updateDoc.Request[] = await this.cross(pharmacy, data)

            console.log(newData)
            const result = await this.DrugRepo.updateDoc(...newData)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async cross(pharmacy:any, data: any[]): Promise<any[]> {
        const newData:updateDoc.Request[] = await []

        for(const el of data){
                const findOne = await this.DrugRepo.findOne({_id: el.id})
    
                if(findOne) {
                    if((findOne.pharmacy as any)._id.toString() == (pharmacy as any)._id.toString()) {
                        newData.push(el)
                    }
                }
        }
        return newData
    }

}