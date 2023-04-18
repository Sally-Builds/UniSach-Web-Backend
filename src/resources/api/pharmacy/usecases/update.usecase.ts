import UpdateInterface, {Update} from "../interfaces/usecases/update.interface";
import PharmacyRepositoryInterface from "../interfaces/pharmacyRepo.interface";
import Exception from "@/utils/exception/Exception";


export default class UpdatePharmacyUsecase implements UpdateInterface {
    constructor(private readonly PharmRepo: PharmacyRepositoryInterface) {}

    async execute(query: any, userId: string, data: Update.Request): Promise<Update.Response> {
        try {
            const user = await this.PharmRepo.findOne({userId})
            
            if(query._id != user?.id) throw new Exception('Forbidden', 403)
            const pharmacy = await this.PharmRepo.findOneAndUpdate(query, data)

            if(!pharmacy) throw new Exception('not found', 404)

            return pharmacy
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}