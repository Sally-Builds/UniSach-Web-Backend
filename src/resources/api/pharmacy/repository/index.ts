import Exception from "@/utils/exception/Exception";
import PharmacyRepositoryInterface, {pharmacy, find, findOne, findOneAndUpdate} from "../interfaces/pharmacyRepo.interface";
import PharmacyModel from '../model/index'

export default class pharmacyRepo implements PharmacyRepositoryInterface {
    public async createPharmacy(data: pharmacy.Request): Promise<pharmacy.Response> {
        try {
            const pharmacy = new PharmacyModel(data)
            await pharmacy.save();

            return pharmacy
        } catch (error:any) {
            throw new Exception(error, 500)
        }
    }

    public async findOne(query: any): Promise<findOne.Response> {
        try {
            const pharmacy = await PharmacyModel.findOne(query);

            return pharmacy
        } catch (error:any) {
            throw new Exception(error, 500)
        }
    }

    public async find(query: any): Promise<find.Response> {
        try {
            const pharmacies = await PharmacyModel.find(query)

            return pharmacies;
        } catch (error:any) {
            throw new Exception(error, 500)
        }
    }

    public async findOneAndUpdate(query: any, data: any): Promise<findOneAndUpdate.Response> {
        try {
            const pharmacy = await PharmacyModel.findOneAndUpdate(query, data, {runValidators: true, new: true})

            return pharmacy
        } catch (error:any) {
            throw new Exception(error, 500)
        }
    }
}