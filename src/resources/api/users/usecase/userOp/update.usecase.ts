import Exception from "@/utils/exception/Exception";
import UpdateInterface, { Update } from "../../interfaces/usecases/userOp/update.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";

export default class UpdateUsecase implements UpdateInterface {
    constructor(private readonly UserRepo: UserRepositoryInterface){}

    public async execute(data: Update.Request, id: string): Promise<Update.Response> {
        try {
            const updatedUser = await this.UserRepo.findOneAndUpdate({_id: id}, data)

            if(!updatedUser) throw new Exception("user not found", 404)

            return updatedUser
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}