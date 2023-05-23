import Exception from "@/utils/exception/Exception";
import pharmacyRepo from "../../pharmacy/repository";
import DrugRepo from "../repository";

import CreateDrugUsecase from "../usecases/create.usecase";
import {create} from "../interfaces/usecases/create.interface";

import FindDrugUsecase from "../usecases/find.usecase";
import FindOneDrugUsecase from "../usecases/findOne.usecase";

import UpdateDrugUsecase from "../usecases/update.usecase";
import UpdateDrugInterface from "../interfaces/usecases/update.interface";

import DeleteDrugUsecase from "../usecases/delete.usecase";
import DeleteDrugInterface, { deleteDoc } from "../interfaces/usecases/delete.interface";
import { updateDoc } from "../interfaces/drugRepo.interface";

export default class DrugBootstrap {
    private CreateDrugUsecase
    private FindDrugUsecase
    private FindOneDrugUsecase
    private UpdateDrugUsecase
    private DeleteDrugUsecase

    constructor() {
        const pharmRepository = new pharmacyRepo()
        const drugRepository = new DrugRepo()

        this.CreateDrugUsecase = new CreateDrugUsecase(drugRepository, pharmRepository)
        this.FindDrugUsecase = new FindDrugUsecase(drugRepository)
        this.FindOneDrugUsecase = new FindOneDrugUsecase(drugRepository)
        this.UpdateDrugUsecase = new UpdateDrugUsecase(drugRepository, pharmRepository)
        this.DeleteDrugUsecase = new DeleteDrugUsecase(drugRepository, pharmRepository)
    }

    public createDrug = async (userId: string, payload: create.Request[]) => {
        try {
            const result = await this.CreateDrugUsecase.execute(userId, ...payload)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public findDrugs = async (query: any) => {
        try {
            const results = await this.FindDrugUsecase.execute(query)

            return results
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public findDrug = async (id: string) => {
        try {
            const result = await this.FindOneDrugUsecase.execute(id)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public updateDrugs = async (userId: string, payload: updateDoc.Request[]) => {
        try {
            const result = await this.UpdateDrugUsecase.execute(userId, ...payload)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public deleteDrugs = async (userId: string, payload: deleteDoc.Request) => {
        try {
            const result = await this.DeleteDrugUsecase.execute(userId, payload)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}