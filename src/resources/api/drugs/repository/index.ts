import DrugRepositoryInterface, { deleteDoc, DeleteInterfaceDrug, UpdateInterfaceDrug, drug, find, updateDoc, findOneN } from "../interfaces/drugRepo.interface";
import DrugModel from '../model/index'
import Exception from "@/utils/exception/Exception";

export default class DrugRepository implements DrugRepositoryInterface {

    public async create(...data: drug.Request[]): Promise<drug.Response> {
        try {
            const drugs = await DrugModel.create(data)

            return drugs
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async find(query: any): Promise<find.Response> {
        try {
            const drugs = await DrugModel.find(query)

            return drugs
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async findOne(query: any): Promise<findOneN.Response> {
        try {
            const drugs = await DrugModel.findOne(query)

            return drugs
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async updateDoc(...data: updateDoc.Request[]): Promise<updateDoc.Response> {
        try {
            const updates = await DrugModel.bulkWrite((this.updateFormatting(data) as any))

            return updates
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async deleteDoc(...ids: string[]): Promise<deleteDoc.Response> {
        try {
            const del = this.deleteFormatting(ids)
            const deletes = await DrugModel.bulkWrite((this.deleteFormatting(ids) as any))

            return (deletes as any)
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    private deleteFormatting (ids: string[]): DeleteInterfaceDrug[] {
        let deleteOneArray:DeleteInterfaceDrug[] = []
        ids.forEach((doc) => {
        let deletes = {
                deleteOne: {
                    filter: {_id: doc},
                }
            }
            deleteOneArray.push(deletes)
        })

        return deleteOneArray
    }

    private updateFormatting (docs: updateDoc.Request[]): UpdateInterfaceDrug[] {
        let updateOneArray:UpdateInterfaceDrug[ ] = []
        docs.forEach((doc) => {
        let updates = {
                updateOne: {
                    filter: {_id: (doc.id as string)},
                    update: {...doc, _id: undefined}
                }
            }
            updateOneArray.push(updates)
        })
        return updateOneArray
    }
}