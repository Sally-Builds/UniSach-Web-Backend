import CreatePharmacyUsecase from "../usecases/create.usecase";
import pharmacyRepo from "../repository";
import Exception from "@/utils/exception/Exception";
import { Create } from "../interfaces/usecases/create.interface";




export default class PharmacyBootstrap {
    private CreatePharmacyUsecase;

    constructor() {
        const repository = new pharmacyRepo()
         this.CreatePharmacyUsecase = new CreatePharmacyUsecase(repository)
    }

    public createPharmacy = async (data: Create.Request) => {
        try {
            const pharmacy = await this.CreatePharmacyUsecase.execute(data)

            return pharmacy
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}