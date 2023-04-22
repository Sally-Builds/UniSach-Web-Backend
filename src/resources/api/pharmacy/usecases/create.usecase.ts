import Exception from "@/utils/exception/Exception";
import CreateInterface, {Create} from "../interfaces/usecases/create.interface";
import PharmacyRepositoryInterface from "../interfaces/pharmacyRepo.interface";



export default class CreatePharmacyUsecase implements CreateInterface {
    constructor(private readonly PharmRepo: PharmacyRepositoryInterface){}
    public async execute(data: Create.Request): Promise<Create.Response> {
        try {
            const checkName = await this.PharmRepo.findOne({name: data.name})
            if(checkName) throw new Exception('Pharmacy name already exists', 400)
            const pharmacy = await this.PharmRepo.createPharmacy(data)

            return pharmacy
        } catch (error:any) {
           throw new Exception(error.message, error.statusCode)
        }
    }
}