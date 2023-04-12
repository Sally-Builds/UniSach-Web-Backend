import Exception from "@/utils/exception/Exception";
import SoftDeleteUserInterface from "../../interfaces/usecases/userOp/SoftDeleteUser.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";


export default class SoftDeleteUsecase implements SoftDeleteUserInterface {
    constructor(private readonly UserRepo: UserRepositoryInterface) {}
    
    async execute(id: string): Promise<void> {
        try {
            const user = await this.UserRepo.findOne({_id: id})

            if(!user) throw new Exception('user not found', 404)

            await this.UserRepo.findOneAndUpdate({_id: id}, {active: false, refreshToken: []})

        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}