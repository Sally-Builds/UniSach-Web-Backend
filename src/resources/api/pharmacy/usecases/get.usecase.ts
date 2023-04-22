import GetInterface, {Get} from "../interfaces/usecases/get.interface";
import PharmacyRepositoryInterface from "../interfaces/pharmacyRepo.interface";
import Exception from "@/utils/exception/Exception";


export default class GetPharmacyUsecase implements GetInterface {
    constructor(private readonly PharmRepo: PharmacyRepositoryInterface){}
    public async execute(query: any): Promise<Get.Response> {
        try {
            const pharmacy = await this.PharmRepo.findOne(query)
            
            if(!pharmacy) throw new Exception('not found', 404)

            return pharmacy;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}