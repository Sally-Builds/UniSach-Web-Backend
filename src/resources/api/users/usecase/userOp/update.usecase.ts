import Exception from "@/utils/exception/Exception";
import UpdateInterface, { Update } from "../../interfaces/usecases/userOp/update.interface";
import User from "../../interfaces/user.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";

export default class UpdateUsecase implements UpdateInterface {
    constructor(private readonly UserRepo: UserRepositoryInterface){}

    public async execute(data: Update.Request, id: string): Promise<Update.Response> {
        try {
            const user = await this.UserRepo.findOne({_id: id})

            if(!user) throw new Exception("user not found", 404)

            let name = user.name
            if(data.first_name) {
                name = `${data.first_name}  ${name.split(" ")[1]}`
            }
            if(data.last_name) {
                name = `${name.split(" ")[0]} ${data.last_name}`
            }

            (data as any).name = name
            const updatedUser = await this.UserRepo.findOneAndUpdate({_id: id}, data)

            return {
                ...JSON.parse(JSON.stringify(updatedUser)), 
                refreshToken: undefined,
                emailVerificationStatus: undefined,
                verificationCode: undefined,
                confirmationCodeExpiresIn: undefined,
                password: undefined
            }
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}