import CreatePharmacyUsecase from "../usecases/create.usecase";
import GetAllPharmacyUsecase from "../usecases/getAll.usecase";
import GetPharmacyUsecase from "../usecases/get.usecase";
import UpdatePharmacyUsecase from "../usecases/update.usecase";
import pharmacyRepo from "../repository";
import Exception from "@/utils/exception/Exception";
import { Create } from "../interfaces/usecases/create.interface";
import { Update } from "../interfaces/usecases/update.interface";




export default class PharmacyBootstrap {
    private CreatePharmacyUsecase;
    private GetAllPharmacyUsecase
    private GetPharmacyUsecase
    private UpdatePharmacyUsecase


    constructor() {
        const repository = new pharmacyRepo()
         this.CreatePharmacyUsecase = new CreatePharmacyUsecase(repository)
         this.GetAllPharmacyUsecase = new GetAllPharmacyUsecase(repository)
         this.GetPharmacyUsecase = new GetPharmacyUsecase(repository)
         this.UpdatePharmacyUsecase = new UpdatePharmacyUsecase(repository)
    }

    public createPharmacy = async (data: Create.Request) => {
        try {
            const pharmacy = await this.CreatePharmacyUsecase.execute(data)

            return pharmacy
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public getPharmacy = async (query: any) => {
        try {
            const result = await this.GetPharmacyUsecase.execute(query)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public getAllPharmacy = async (query: any) => {
        try {
            const results = await this.GetAllPharmacyUsecase.execute(query)

            return results
        }catch(error: any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public updatePharmacy = async (query: any, userId: string, data: Update.Request) => {
        try {
            const result = await this.UpdatePharmacyUsecase.execute(query, userId, data)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}