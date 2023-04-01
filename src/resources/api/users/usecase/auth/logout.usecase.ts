import Exception from "@/utils/exception/Exception";
import Logout from "../../interfaces/usecases/auth/logout.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";


export default class LogoutUsecase implements Logout {
    constructor(private readonly UserRepository: UserRepositoryInterface) {}
    async execute(refreshToken: string): Promise<string> {
        try {
            const user = await this.UserRepository.findOne({refreshToken})
            if(!user) return 'success'

            let newRefreshTokenArray = user.refreshToken?.filter((rt: string) => rt != refreshToken)
            await this.UserRepository.findOneAndUpdate({refreshToken}, {refreshToken: newRefreshTokenArray})

            return 'success'
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}